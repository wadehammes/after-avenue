# Handbook routing (for tools and LLMs)

Use this page to choose **which markdown file to read first**. It mirrors the full handbook index in **[README.md](README.md)**—paste the relevant paths (or this whole file) into custom GPT instructions, other agents, or docs that do not load Cursor rules.

**Convention:** paths are relative to `docs/handbook/` (e.g. `contentful.md`).

## Task → chapter

| Task or question | Read first |
|------------------|------------|
| Stack, folders, App Router layout, Contentful → page render flow | [architecture.md](architecture.md) |
| TypeScript / React style, Biome, CSS Modules, tests, test IDs, a11y, `next/image`, React Query hooks | [conventions.md](conventions.md) |
| Contentful types/codegen, getters, parsers, sections vs content blocks, ContentRenderer, Rich Text | [contentful.md](contentful.md) |
| Component folder layout, `pnpm scaffold`, exports, dynamic imports, internal/external links | [components.md](components.md) |
| Server components, caching, React Query, `src/api`, forms, metadata / JSON-LD | [patterns.md](patterns.md) |
| CI, `pnpm` scripts, `next.config` (env, redirects), draft APIs, `src/proxy.ts` | [platform.md](platform.md) |
| Google Analytics, `dataLayer`, client analytics | [integrations.md](integrations.md) |
| Sitemaps, `public/` XML output | [distribution.md](distribution.md) |
| `src/interfaces`, `src/utils` map, `src/lib` | [source-layout.md](source-layout.md) |

## Outside this folder

| Task | Location |
|------|----------|
| Install ASDF/pnpm, Vercel env, first run | Repo root **[README.md](../../README.md)** |
| Agent defaults (read handbook, keep it updated) | Repo root **[AGENTS.md](../../AGENTS.md)**; Cursor **[`.cursor/rules/after-avenue-handbook.mdc`](../../.cursor/rules/after-avenue-handbook.mdc)** |

## Suggested instruction blurb (copy-paste)

```text
Before substantive edits, read docs/handbook/README.md and the chapter that matches the task (see docs/handbook/llms.md for a task→chapter map). When your change affects behavior, setup, or how features should be built, update the relevant docs/handbook/*.md in the same PR or an immediate follow-up so the handbook stays accurate.
```
