# After Avenue handbook

This is the **After Avenue handbook**: how the site is put together, how we write code, how Contentful feeds the UI, and where to look when you are debugging or adding a feature.

You do not have to read everything in one sitting. Skim the index, bookmark what you need, and come back when you touch that area. **Do keep these docs honest**—when behavior in the repo changes, update the matching page here so the next person (or tool) is not led astray.

**For tools and LLMs** (custom GPTs, other agents): **[llms.md](llms.md)** is a compact **task → chapter** map and a short copy-paste instruction blurb.

## How to read this handbook

The order below is the path we recommend for a full onboarding. If you are in a hurry, read **[architecture.md](architecture.md)** first, then jump to the chapter that matches your task (Contentful, components, CI, and so on).

1. **Orientation** — [architecture.md](architecture.md): stack, folders, App Router, and how data gets from Contentful to the screen.
2. **Day-to-day coding** — [conventions.md](conventions.md): TypeScript, React, CSS, tests, accessibility.
3. **CMS work** — [contentful.md](contentful.md): types, getters, parsers, sections and content blocks.
4. **UI structure** — [components.md](components.md): folders, files, tests.
5. **App patterns** — [patterns.md](patterns.md): App Router data loading, React Query, API routes, forms, SEO.
6. **Operations & tooling** — [platform.md](platform.md): CI, env, and `proxy.ts`.
7. **Analytics & tags** — [integrations.md](integrations.md): GA, data layer, third parties.
8. **Sitemaps** — [distribution.md](distribution.md): sitemap generation and public output.
9. **Where things live** — [source-layout.md](source-layout.md): interfaces, `src/utils`, `src/lib`.

## Index of docs

Quick lookup—one line per file:

| File | What it covers |
|------|----------------|
| [architecture.md](architecture.md) | Tech stack, directory map, `src/app`, data flow, key config. Start here. |
| [conventions.md](conventions.md) | TypeScript, Biome, Stylelint, CSS Modules, testing (page objects, `@jest/globals`, `userEvent`, factories, mocking), test IDs, accessibility, React Query hook rules. |
| [contentful.md](contentful.md) | Generated types, getters, parsers, sections vs modules, Rich Text, client. |
| [components.md](components.md) | Component folder layout, `pnpm scaffold`, page objects, test IDs, exports, dynamic imports, links. |
| [patterns.md](patterns.md) | Server components, React Query, `src/api` (`postJson`, `fetchResponse`), forms, layout, metadata, JSON-LD, embedded video performance (`VideoPlayer`, lazy mount, editors background). |
| [platform.md](platform.md) | GitHub CI (tsc, Biome, Stylelint, Jest, Knip), `pnpm` scripts, `next.config`, draft mode APIs, `src/proxy.ts`. |
| [integrations.md](integrations.md) | Google Analytics, data layer, related env. |
| [distribution.md](distribution.md) | Sitemap generation and `public/` output. |
| [source-layout.md](source-layout.md) | `src/interfaces`, `src/utils`, `src/api`, `src/hooks`, `src/tests`, `src/lib`. |
| [llms.md](llms.md) | Task-to-chapter routing for tools; copy-paste blurb for non-Cursor agents. |

## Development setup

Machine setup (ASDF, pnpm, Vercel env, first `pnpm dev`) lives in the root **[README.md](../../README.md)** so we do not maintain two copies. After you are up and running locally, use this handbook when you are actually changing the app.

**Agents:** defaults and “keep docs in sync” expectations are in the repo root **[AGENTS.md](../../AGENTS.md)**. **Cursor** loads **[`.cursor/rules/after-avenue-handbook.mdc`](../../.cursor/rules/after-avenue-handbook.mdc)** as a project rule.
