# Components

New UI lives under `src/components/<Name>/`. This page describes the files we expect in that folder and how tests and dynamic imports fit in.

## Folder layout

One directory per component under `src/components/<ComponentName>/`. Use **PascalCase** for the folder and file names.

### File types and when to use them

| File | Purpose |
|------|--------|
| **`<Name>.component.tsx`** | Main React component. Keep it focused on composition and minimal logic. Use CSS Modules (import `styles` from `./<Name>.module.css`) and apply class names. |
| **`<Name>.po.tsx`** | Page object for tests (when you add them). Extends `BasePageObject`, sets `testId = "rh<Name>"`, implements `render<Name>(...)` with `render()` from [testUtils.tsx](../../src/tests/testUtils.tsx), and holds **setup and test data** only—queries belong in the spec via `screen` (see [conventions.md](conventions.md)). |
| **`<Name>.spec.tsx`** | Jest tests: page object in `beforeEach`, then **`screen` and `userEvent`** for assertions and interactions. |
| **`<Name>.interfaces.ts`** | Use when the component has **public** props or data types not already defined by a Contentful parser. CMS-driven components often use parsed types from `src/contentful/parse*.ts` directly. |
| **`<Name>.factory.ts`** | Optional. Rosie / Faker factory for test data when props are complex (see [conventions.md](conventions.md)). |
| **`<Name>.module.css`** | Layout, spacing, typography, responsive rules. Use nesting and design tokens from [globals.css](../../src/styles/globals.css). |
| **`use<Something>.ts`** | Optional. Colocate a hook used only by this component in the same folder. |

## Scaffold

Run **`pnpm scaffold <ComponentName>`** when you want a head start—it creates the usual filenames and stubs (component, CSS module, interfaces, factory, page object, spec) under `src/components/<ComponentName>/`.

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

## Links

- **Internal navigation**: Use `next/link`’s `Link` with stable `href` values.
- **External links**: Use `<a>` with `target="_blank"` and `rel="noopener noreferrer"` when opening in a new tab.
