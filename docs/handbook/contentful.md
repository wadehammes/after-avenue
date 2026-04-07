# Contentful integration

Most pages are driven by Contentful. This guide explains how **generated types**, **getters** (fetch), and **parsers** (normalize) fit together, and how sections and content blocks reach the UI.

## Content types (generated)

All Contentful content type TypeScript definitions live under `src/contentful/types/`. They are **generated** from the CMS and must not be edited by hand.

- **Regenerate**: Run `pnpm types:contentful` (requires `CONTENTFUL_SPACE_ID` and `CONTENTFUL_CMA_TOKEN` in env). The script runs Biome format on the generated types.
- When the CMS schema changes, regenerate and fix any parser or component that breaks.

## Getters

**Getters** are async functions that talk to Contentful through [src/contentful/client.ts](../../src/contentful/client.ts).

- **Examples**: [getPages.ts](../../src/contentful/getPages.ts), [getNavigation.ts](../../src/contentful/getNavigation.ts), [getGlobalVariables.ts](../../src/contentful/getGlobalVariables.ts), [getWork.ts](../../src/contentful/getWork.ts), [getEditors.ts](../../src/contentful/getEditors.ts).
- **Preview**: Pass `preview: true` when draft/preview mode is active so the preview client and token are used.

## Parsers

For every section or content block we render, a **parser** in `src/contentful/parse*.ts` turns the raw entry into a shape React can consume.

- **Input**: Raw Contentful entry types from generated `src/contentful/types/`.
- **Output**: Normalized app types (plain objects with `id` and typed fields).
- **Helpers**: [src/contentful/helpers.ts](../../src/contentful/helpers.ts) includes patterns such as `ContentfulTypeCheck` and `ExtractSymbolType` where parsers need them.
- **Assets**: [parseContentfulAsset.ts](../../src/contentful/parseContentfulAsset.ts) normalizes assets across parsers.

## Sections vs content blocks

### Sections

Sections are the top-level building blocks attached to a page in Contentful.

- **Parsed in**: [parseSections.ts](../../src/contentful/parseSections.ts) (and related types).
- **Rendered by**: [SectionRenderer.component.tsx](../../src/components/SectionRenderer/SectionRenderer.component.tsx) and [Section.component.tsx](../../src/components/Section/Section.component.tsx).

### Content blocks

Modules (content cards, copy blocks, slides, module groups, etc.) **live inside** sections.

- **Parsed in**: Individual `parse*.ts` files (e.g. [parseContentCard.ts](../../src/contentful/parseContentCard.ts), [parseComponentModules.ts](../../src/contentful/parseComponentModules.ts)).
- **Rendered by**: [ContentRenderer.component.tsx](../../src/components/ContentRenderer/ContentRenderer.component.tsx), which switches on content type, runs the parser, and renders the matching component.

## Adding a new Contentful-driven block (checklist)

1. **Types**: Confirm the content type exists in Contentful, then run `pnpm types:contentful`.
2. **Parser**: Add or extend `src/contentful/parse<Name>.ts` with a normalized type and `parseContentful…` function; use `ContentfulTypeCheck` / `ExtractSymbolType` when helpful.
3. **ContentRenderer**: In [ContentRenderer.component.tsx](../../src/components/ContentRenderer/ContentRenderer.component.tsx), handle the new content type: parse the entry and render the component with typed props.
4. **Section parser**: If the block appears inside a section’s content array, ensure [parseSections.ts](../../src/contentful/parseSections.ts) (or the union it uses) includes the new type in its content union and parsing logic.
5. **Component**: Implement the UI with CSS Modules per [conventions.md](conventions.md).

## Rich Text

Rich Text is rendered with `@contentful/rich-text-react-renderer` where the design calls for it. Reuse shared options and typography patterns from nearby components so links and marks stay consistent.

## Client and environment

- **Client**: [src/contentful/client.ts](../../src/contentful/client.ts) is the one place we construct Contentful clients for delivery and preview.
- Do **not** create ad-hoc clients in random files—reuse this module and the getters/parsers so tokens and behavior stay aligned.
- **Caching**: [cacheConfig.ts](../../src/contentful/cacheConfig.ts) exports `CONTENTFUL_CACHE_REVALIDATE` for `unstable_cache`. Route-level ISR uses the same rules via an **inline** `export const revalidate` in [layout.tsx](../../src/app/layout.tsx) (Next.js cannot use imported constants for segment config). Production uses `false`; other environments use one day. [refresh-content](../../src/app/refresh-content/page.tsx) overrides with `0`. Work list pagination uses a page size of 500 entries per Contentful request when walking all work.
