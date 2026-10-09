# Platform, CI, and environment

This page covers **CI**, **env vars**, **draft preview**, and **`src/proxy.ts`**.

## Continuous integration

PRs that target **`staging`** run [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

1. Checkout
2. **pnpm** + **Node** from [`.tool-versions`](../../.tool-versions)
3. **`pnpm install`**
4. **`pnpm tsc:ci`** — TypeScript strict (does **not** require gitignored **`next-env.d.ts`**; SVGR icon types live in [`src/@types/svg.d.ts`](../../src/@types/svg.d.ts)—see [conventions.md](conventions.md))
5. **`pnpm lint:ci`** — Biome in CI reporter mode
6. **`pnpm lint:css`** — Stylelint on CSS Modules
7. **`pnpm test:ci`** — Jest
8. **`pnpm knip:ci`** — unused files, exports, and dependencies

Run **`pnpm lint:all`** (Biome on changes since **`origin/staging`**, Stylelint fix, **`tsc:ci`**, **`knip:ci`**) and **`pnpm test:ci`** locally before pushing when you touch types, lint, tests, or dependencies. CI still runs **`lint:ci`** (Biome, full repo) separately from **`lint:changed`**.

## Package scripts (local workflow)

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server on port 3005 with **Turbopack** (see root README). Use `pnpm dev:webpack` only if you need the legacy webpack dev server. |
| `pnpm build` / `pnpm start` | Production build and serve (`next build` with Turbopack, then `make sitemap`). Use **`pnpm build`** — not bare `next build` — so the sitemap step runs. Vercel is configured via [`vercel.json`](../../vercel.json) to run `pnpm build`. Use `pnpm build:webpack` for the legacy webpack production build. |
| `pnpm build:analyze` | Turbopack bundle analysis via `next experimental-analyze` (see package.json). |
| `pnpm lint` / `pnpm lint:fix` / `pnpm format` | Biome (same family as `lint:ci`). |
| `pnpm lint:changed` | Biome on files changed since **`origin/staging`** (errors only; see [conventions.md → Formatting and linting](conventions.md#formatting-and-linting)). |
| `pnpm lint:all` | **`lint:changed`**, **`lint:css:fix`**, **`tsc:ci`**, **`knip:ci`**. |
| `pnpm lint:css` / `pnpm lint:css:fix` | Stylelint on `**/*.css`. |
| `pnpm test:ci` | Jest (CI-style). |
| `pnpm knip` / `pnpm knip:ci` | Find unused files, exports, and dependencies ([`knip.json`](../../knip.json)). Jest-only mock exports loaded via **`jest.mock`** in [`.jest/setupTests.ts`](../../.jest/setupTests.ts) are listed under **`ignoreIssues`** there so Knip does not treat them as dead code. |
| `pnpm handbook:check` | Fail if **`src/`** (or test infra / **`next.config`**) changed vs **`origin/staging`** without any **`docs/handbook/*.md`** in the same diff — uses [`.cursor/hooks/_lib.sh`](../../.cursor/hooks/_lib.sh) chapter suggestions. |
| `pnpm scaffold` | New component folder under `src/components/` (see [components.md](components.md)). |
| `pnpm email:dev` | React Email preview server for `src/emails/` on port **3006** (see [patterns.md → Transactional email](patterns.md#transactional-email-react-email)). |
| `pnpm types:contentful` | Regenerate `src/contentful/types` (needs CMA env vars). |

The full list lives in **[`package.json`](../../package.json)**.

## pnpm workspace

**[`pnpm-workspace.yaml`](../../pnpm-workspace.yaml)** sets **`nodeLinker: hoisted`** so Jest and other Node tools resolve dependencies predictably (aligned with delmarva-site). It also holds **`allowBuilds`**, **`overrides`**, and **`minimumReleaseAge`** policy for installs—run **`pnpm install`** after changing this file.

## Cursor agent hooks

Project agent hooks live in [`.cursor/hooks.json`](../../.cursor/hooks.json) and [`.cursor/hooks/`](../../.cursor/hooks/README.md) (patterns aligned with rhythm-marketing **`.claude/`**). **`preToolUse`** injects handbook routing before edits and blocks hand-edits to **`src/contentful/types/`**; **`postToolUse`** handbook-sync nudges on mapped paths; **`stop`** runs [`.cursor/hooks/handbook-drift-check.mjs`](../../.cursor/hooks/handbook-drift-check.mjs) (broken doc links, stale **`pnpm`** refs, code-without-docs, renames). Optional CI gate: **`pnpm handbook:check`** ([`scripts/handbook-sync-check.sh`](../../scripts/handbook-sync-check.sh) vs **`origin/staging`**). Requires `bash`, `jq`, `node`, `git`, and executable hook scripts.

## Environment variables and `next.config`

**[`next.config.ts`](../../next.config.ts)** lists env vars exposed to the app under `env: { ... }`. If a name is not listed, the client bundle will not see it. Keep secrets off `NEXT_PUBLIC_*`.

**Bundler (Next 16.4):** Dev and production use **Turbopack** by default (`next` **^16.4.0** in [`package.json`](../../package.json)). SVG imports use the `turbopack.rules` SVGR config; the legacy `webpack()` block remains for `pnpm dev:webpack`, `pnpm build:webpack`, and `pnpm build:analyze:legacy`. **`experimental.useTypeScriptCli`** is on (TypeScript 7 for build-type checks). **`experimental.optimizePackageImports`** lists packages such as **`@base-ui/react`**, **`@tanstack/react-query`**, and **`react-intersection-observer`**—**not** **`react-player`** (nested lazy player chunks + Turbopack). If production video fails with “module factory is not available”, confirm **`LazyReactPlayer`** still uses **`next/dynamic`** or temporarily **`pnpm build:webpack`**. **Instant Navigations** (`cacheComponents`, `partialPrefetching`) is opt-in and needs a separate migration from segment `revalidate` exports — not enabled here yet.

**Security headers:** [`headers()`](../../next.config.ts) sets CSP (Vimeo/YouTube on **`script-src`**, **`child-src`**, **`connect-src`**, including **`*.vimeocdn.com`**), HSTS, and related policies on all routes.

**Jest:** Configuration lives in **[jest.config.ts](../../jest.config.ts)** with setup in **[`.jest/setupTests.ts`](../../.jest/setupTests.ts)** — see [conventions.md → Jest configuration](conventions.md#jest-configuration).

Configure values in **Vercel** (or your host) and mirror locally via `npx vercel env pull` as described in the root README.

**Cache-Control** in [`headers()`](../../next.config.ts): HTML pages get long-lived cache in **production** only. In **development**, pages use `no-store` and `_next` is excluded from page rules so HMR/RSC are not cached (avoids refresh loops in `next dev`).

Notable env groups:

- **Contentful** — space, delivery/preview tokens, preview secret, CMA token for codegen.
- **ENVIRONMENT** — drives URLs in helpers such as [envUrl()](../../src/utils/helpers.ts).
- **HubSpot, Resend, reCAPTCHA** — used by Route Handlers and forms. Shared API field rules (**email**, **name**, **phone**) live in [formFieldSchemas.ts](../../src/lib/forms/formFieldSchemas.ts) as **`contactApiFieldsSchema`**; [contactForm.schema.ts](../../src/lib/forms/contactForm.schema.ts) builds **`contactFormApiSchema`** (contact email + reCAPTCHA) and **`hubspotLeadApiSchema`** (lead payload). Both [send-email/contact/route.ts](../../src/app/api/send-email/contact/route.ts) and [hubspot/lead-generation/route.ts](../../src/app/api/hubspot/lead-generation/route.ts) **`safeParse`** the JSON body and return **`400`** with **`{ error: "Invalid request" }`** on failure (see [patterns.md → API layer](patterns.md#api-layer-and-route-handlers)). **`RESEND_API_KEY`** powers contact-form delivery; the contact route constructs the Resend client only after the key is present (**`503`** otherwise). Outside **production**, contact mail is **Resend-only** to safe inboxes—never **`hello@afteravenue.com`** or the submitter. Helpers in [emailHelpers.ts](../../src/utils/emailHelpers.ts) use **`isNonProductionContactEnvironment()`** from [helpers.ts](../../src/utils/helpers.ts) (`ENVIRONMENT` **`local`** or **`staging`**, or **`NODE_ENV=development`** during **`pnpm dev`**). Set **`RESEND_DEV_TO_EMAIL`** for local / next dev; on **staging** set **`RESEND_TEST_RECIPIENTS`** (comma-separated; **`RESEND_DEV_TO_EMAIL`** is a fallback). Without those vars, the contact route returns **`503`** and skips confirmation rather than hitting production addresses. Resend audience sync is skipped on staging and local. **`RECAPTCHA_ALLOWED_HOSTNAMES`** optionally extends [recaptcha.ts](../../src/utils/recaptcha.ts) (defaults include **`localhost`**). HubSpot lead generation is skipped outside production (Route Handler and [useSubmitContactFormMutation](../../src/hooks/mutations/useSubmitContactFormMutation.ts)); colocated **`route.spec.ts`** files cover validation and skip behavior.

## Preview and draft mode

Draft mode uses App Router APIs:

- **Enable draft**: [src/app/api/draft/route.ts](../../src/app/api/draft/route.ts) checks `previewSecret` against **`CONTENTFUL_PREVIEW_SECRET`**, enables draft mode, then redirects.
- **Disable draft**: [src/app/api/disable-draft/route.ts](../../src/app/api/disable-draft/route.ts).
- **Preview content**: Getters accept `preview: true` and use the preview client from [client.ts](../../src/contentful/client.ts).

## `src/proxy.ts`

[src/proxy.ts](../../src/proxy.ts) attaches **`x-pathname`** to request headers for downstream use. If you add **Next.js middleware**, import and call `proxy` from there so the behavior is actually applied on each request; otherwise verify whether this helper is referenced anywhere before assuming headers are set.
