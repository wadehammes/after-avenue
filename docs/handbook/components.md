# Components

New UI lives under `src/components/<Name>/`. This page describes the files we expect in that folder and how tests and dynamic imports fit in.

## Folder layout

One directory per component under `src/components/<ComponentName>/`. Use **PascalCase** for the folder and file names.

### File types and when to use them

| File | Purpose |
|------|--------|
| **`<Name>.component.tsx`** | Main React component. Keep it focused on composition and minimal logic. Use CSS Modules (import `styles` from `./<Name>.module.css`) and apply class names. |
| **`<Name>.po.tsx`** | Page object for tests. Extends `BasePageObject`, implements `render<Name>(...)` with `render()` from [test-utils.tsx](../../src/tests/test-utils.tsx). When the component calls the API layer, add `jest.mock("src/api/urls")` here and use [`mockApiResponse`](../../src/tests/mocks/mockApiResponse.ts) for setup helpers. See [ContactForm.po.tsx](../../src/components/ContactForm/ContactForm.po.tsx). |
| **`<Name>.spec.tsx`** | Jest tests: page object in `beforeEach`, **`screen`** for assertions, **`userEvent`** for interactions. |
| **`<Name>.interfaces.ts`** | Use when the component has **public** props or data types not already defined by a Contentful parser. CMS-driven components often use parsed types from `src/contentful/parse*.ts` directly. |
| **`<Name>.factory.ts`** | Optional. Subclass of [`BaseFactory`](../../src/tests/factories/BaseFactory.ts) for test data when tests need complex or repeated props. Define the factory for the same type the component expects. **Lives in [`src/tests/factories/<Name>.factory.ts`](../../src/tests/factories/), not in the component folder**—factories are test infrastructure shared across specs and POs. See the factory shape rules in [conventions.md → Test data](conventions.md#test-data). |
| **`<Name>.module.css`** | Layout, spacing, typography, responsive rules. Use nesting and design tokens from [globals.css](../../src/styles/globals.css). |
| **`use<Something>.ts`** | Optional. Colocate a hook used only by this component in the same folder. |

## Scaffold

Run **`pnpm scaffold <ComponentName>`** when you want a head start—it creates the usual filenames and stubs (component, CSS module, interfaces, page object, spec) under `src/components/<ComponentName>/`, plus a factory at `src/tests/factories/<ComponentName>.factory.ts`.

**Heads-up:** For Contentful-backed components, treat the scaffold as a starting point only—the default **interfaces** / **factory** are generic stubs, not CMS parsers:

1. Drop or replace the default **interfaces** when your props come from a parser type in `src/contentful/`.
2. Wire types and parsers from `src/contentful/` as in [contentful.md](contentful.md).
3. Take props typed as the parser output (for example `metadata: MyBlockType`) when the block is CMS-driven.

## Test ID

The root DOM element of a tested component should have **`data-testid="rh<ComponentName>"`**. The page object should set `testId` to the same value. See [conventions.md](conventions.md).

## Exports

Export the component as both a **named export** (e.g. `export const MyComponent`) and a **default export** (`export default MyComponent`) so imports stay consistent with the scaffold and existing folders.

## Dynamic imports

Use **`next/dynamic`** when a component is heavy or client-only (`ssr: false` when it depends on `window` or browser-only APIs). CMS-driven pieces are imported directly in **ContentRenderer** today; if a block becomes large enough to defer, wrap it with `dynamic` there or in the parent.

**Embedded video**: Do not import **`react-player`** directly in feature components unless you have a one-off reason (e.g. the editors background stack). Use **[`VideoPlayer`](../../src/components/VideoPlayer/VideoPlayer.component.tsx)** or **[`EditorsBackgroundVideo`](../../src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component.tsx)**. See [patterns.md → Embedded video](patterns.md#embedded-video-vimeo--youtube).

## Video-related components

| Component | Role |
|-----------|------|
| [`VideoPlayer`](../../src/components/VideoPlayer/VideoPlayer.component.tsx) | Shared Vimeo/YouTube wrapper (dynamic `react-player`, loading overlay, optional `light` preview). |
| [`WorkCard`](../../src/components/WorkCard/WorkCard.component.tsx) | Work grid card — lazy mount, thumbnail-first when `autoPlay` is false. |
| [`FeaturedWork`](../../src/components/FeaturedWork/FeaturedWork.component.tsx) | Home featured reel (desktop); defers mount until near viewport. |
| [`EditorsBackgroundVideo`](../../src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component.tsx) | Fixed full-viewport background for `/editors`; static MP4 on hover while the next embed preloads. |

## Links

- Use **`next/link`**'s **`Link`** for all links—same-site routes, external URLs, **`mailto:`**, **`tel:`**, and so on. Pass **`href`**. For links that open in a new tab, set **`target`** and **`rel="noopener noreferrer"`** (or equivalent) on **`Link`** as needed.
