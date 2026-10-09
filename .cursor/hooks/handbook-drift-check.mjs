#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, normalize } from "node:path";

const MAX_REPORTED = 20;

const PNPM_BUILTINS = new Set([
  "add",
  "audit",
  "dlx",
  "exec",
  "install",
  "list",
  "outdated",
  "remove",
  "run",
  "store",
  "up",
  "why",
]);

const HIGH_CHURN =
  /LazyReactPlayer|FeaturedWork|WorkCard|WorkHeroVideo|EditorsBackgroundVideo|videoPlayerConfig|emailHelpers|send-email\/contact|hubspot\/lead-generation|useSubmitContactFormMutation|svg\.d\.ts|\.cursor\/hooks\//;

const ROUTING_FOOTER =
  "Routing: docs/handbook/llms.md. Chapters most often left stale: platform.md (scripts, CI, env), conventions.md (test setup, mocks, factories), contentful.md (content model, parsers, renderer), source-layout.md (where files live), architecture.md (directory map, data flow), README.md (the setup a new engineer follows on day one). High-churn pointers: docs/handbook/README.md.";

const readStdin = async () => {
  const chunks = [];

  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  return Buffer.concat(chunks).toString("utf8");
};

const git = (args, cwd) => {
  try {
    return execFileSync("git", args, {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
  } catch {
    return "";
  }
};

const lines = (value) => value.split("\n").filter(Boolean);

const handbookDocs = (cwd) => {
  try {
    return readdirSync(join(cwd, "docs/handbook"))
      .filter((name) => name.endsWith(".md"))
      .sort()
      .map((name) => join("docs/handbook", name));
  } catch {
    return [];
  }
};

const docPaths = (cwd) =>
  [...handbookDocs(cwd), "README.md", "AGENTS.md", "CLAUDE.md"].filter((doc) =>
    existsSync(join(cwd, doc)),
  );

const headingSlugs = (absPath) => {
  const slugs = new Set();

  for (const [, heading] of readFileSync(absPath, "utf8").matchAll(
    /^#+\s+(.*)$/gm,
  )) {
    slugs.add(
      heading
        .replaceAll("`", "")
        .toLowerCase()
        .replace(/[^\p{L}\p{N}_\s-]/gu, "")
        .trim()
        .replaceAll(" ", "-"),
    );
  }

  return slugs;
};

const findBrokenLinks = (cwd) => {
  const broken = [];

  for (const doc of docPaths(cwd)) {
    const absDoc = join(cwd, doc);
    const base = dirname(doc) || ".";

    for (const [, target] of readFileSync(absDoc, "utf8").matchAll(
      /\[[^\]]+\]\(([^)\s]+)\)/g,
    )) {
      if (/^(https?:\/\/|mailto:|#)/.test(target)) {
        continue;
      }

      const [path, anchor] = target.split("#");

      if (!path) {
        continue;
      }

      const resolved = normalize(join(cwd, base, path));

      if (!existsSync(resolved)) {
        broken.push(`${doc}: ${target} (file does not exist)`);
      } else if (
        anchor &&
        resolved.endsWith(".md") &&
        !headingSlugs(resolved).has(anchor)
      ) {
        broken.push(`${doc}: ${target} (no such heading)`);
      }
    }
  }

  return broken.slice(0, MAX_REPORTED);
};

const fencedAndInlineCodeIn = (body) => [
  ...[...body.matchAll(/```[a-z]*\n([\s\S]*?)```/g)].map(([, code]) => code),
  ...[...body.matchAll(/`([^`\n]+)`/g)].map(([, code]) => code),
];

const findMissingScripts = (cwd) => {
  let scripts;

  try {
    scripts = new Set(
      Object.keys(
        JSON.parse(readFileSync(join(cwd, "package.json"), "utf8")).scripts ??
          {},
      ),
    );
  } catch {
    return [];
  }

  const missing = new Set();

  for (const doc of docPaths(cwd)) {
    for (const snippet of fencedAndInlineCodeIn(
      readFileSync(join(cwd, doc), "utf8"),
    )) {
      for (const [, name] of snippet.matchAll(/\bpnpm ([a-z][a-z0-9:_-]*)/g)) {
        if (PNPM_BUILTINS.has(name) || scripts.has(name)) {
          continue;
        }

        missing.add(`${doc}: \`pnpm ${name}\` is not a script in package.json`);
      }
    }
  }

  return [...missing].sort().slice(0, MAX_REPORTED);
};

const collectFindings = (cwd) => {
  const changed = [
    ...new Set([
      ...lines(git(["diff", "--name-only", "HEAD"], cwd)),
      ...lines(git(["ls-files", "--others", "--exclude-standard"], cwd)),
    ]),
  ].sort();

  const matching = (pattern) => changed.filter((file) => pattern.test(file));

  const codeChanged = matching(/^src\/.*\.(ts|tsx|css)$/);
  const opsChanged = matching(
    /^(package\.json|jest\.config\.ts|next\.config\.ts|biome\.json|knip\.json|stylelint\.config\.mjs|pnpm-workspace\.yaml|Makefile|\.tool-versions|\.jest\/.*|\.github\/.*|scripts\/.*|vercel\.json|\.cursor\/hooks\.json)$/,
  );
  const docsChanged = matching(
    /^(docs\/handbook\/.*\.md|README\.md|AGENTS\.md|CLAUDE\.md)$/,
  );
  const contentfulChanged = matching(/^src\/contentful\//);
  const movedOrDeleted = lines(
    git(["diff", "--name-only", "--diff-filter=DR", "HEAD"], cwd),
  );

  const readmeRelevant = matching(
    /^(package\.json|\.tool-versions|docs\/handbook\/platform\.md|Makefile|pnpm-workspace\.yaml|vercel\.json)$/,
  );
  const readmeChanged = matching(/^README\.md$/);

  const findings = [];
  const brokenLinks = findBrokenLinks(cwd);
  const missingScripts = findMissingScripts(cwd);

  if (brokenLinks.length > 0) {
    findings.push(
      `Broken handbook links (a referenced file moved, was renamed, or the heading changed) — fix the link or the doc text:\n${brokenLinks.join("\n")}`,
    );
  }

  if (missingScripts.length > 0) {
    findings.push(
      `Docs reference pnpm scripts that no longer exist — update the doc to the real script name (or add the script):\n${missingScripts.join("\n")}`,
    );
  }

  const highChurnTouched = changed.filter((file) => HIGH_CHURN.test(file));

  if (highChurnTouched.length > 0) {
    findings.push(
      `High-churn areas touched — read docs/handbook/README.md (High-churn areas) before you close this out:\n- Embedded video: patterns.md#embedded-video-vimeo--youtube, components.md#video-related-components\n- Contact / Resend / HubSpot: patterns.md (Forms, Transactional email), platform.md env vars\n- CI / types / hooks: conventions.md, platform.md\n\nRelated files this session:\n${highChurnTouched.join("\n")}`,
    );
  }

  if (contentfulChanged.length > 0 && existsSync(join(cwd, ".env.local"))) {
    findings.push(
      "This session touched src/contentful/. Confirm the generated types still match the space before you stop: regenerate into a scratch dir and diff (see docs/handbook/contentful.md → Content types (generated)).",
    );
  }

  if (codeChanged.length + opsChanged.length > 0 && docsChanged.length === 0) {
    const scope = [];

    if (codeChanged.length > 0) {
      scope.push(`Changed code:\n${codeChanged.join("\n")}`);
    }

    if (opsChanged.length > 0) {
      scope.push(
        `Changed config/ops (these are documented in platform.md — scripts, CI steps, env, jest config, next.config):\n${opsChanged.join("\n")}`,
      );
    }

    findings.push(
      `This session changed code or config but no handbook chapter. If any change shifted documented behavior or conventions, update the matching chapter now (docs/handbook/llms.md routes task → chapter). If nothing documented changed, you may stop.\n\n${scope.join("\n")}`,
    );
  }

  if (readmeRelevant.length > 0 && readmeChanged.length === 0) {
    findings.push(
      `README: this session changed setup/platform surfaces but not README.md. If install, env, scripts, or tech stack sections are now wrong, update the root README. If the public README is still accurate, say so explicitly.\n\nREADME-relevant files:\n${readmeRelevant.join("\n")}`,
    );
  }

  if (movedOrDeleted.length > 0) {
    findings.push(
      `This session renamed or deleted files. Grep the handbook and README for each old path — a moved file leaves a dead link and a wrong instruction behind:\n${movedOrDeleted.join("\n")}`,
    );
  }

  return findings;
};

const main = async () => {
  let payload = {};

  try {
    payload = JSON.parse(await readStdin());
  } catch {
    payload = {};
  }

  const loopCount = Number(payload.loop_count ?? 0);

  if (loopCount >= 1) {
    return;
  }

  const cwd = payload.cwd ?? process.cwd();
  process.chdir(cwd);

  const findings = collectFindings(cwd);

  if (findings.length === 0) {
    return;
  }

  const reason = `Handbook-drift check:\n\n${findings.join("\n\n")}\n\n${ROUTING_FOOTER}`;

  process.stdout.write(JSON.stringify({ followup_message: reason }));
};

await main();
