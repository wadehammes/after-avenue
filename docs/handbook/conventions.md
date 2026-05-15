# Conventions

This is the house style: how we format TypeScript and React, how we structure CSS and tests, and the small habits that keep reviews short. The goal is for the repo to read like one careful team wrote it. When something here conflicts with a local shortcut, follow the doc (or open a PR to change the doc if the rule is wrong).

If you are unsure, copy a nearby file that already does the right thing and run **`pnpm lint`** before you push.

## TypeScript

- **Blank line after declarations.** After `const` / `let` declarations in a function or block, leave one blank line before the next statement when that statement is control flow (`if`, `for`, `while`, `switch`, `try`) or a `return` (or other logic that is not another declaration). Do not insert a blank line between consecutive declarations that form one setup block (e.g. several `const` lines, then a blank line, then `if`). Example:

```ts
const spaceId = process.env.CONTENTFUL_SPACE_ID;

if (!spaceId || !entryId) {
  return null;
}
```

- **Use arrow functions always.** Prefer `const fn = () => {}` over `function fn() {}`.
- **If blocks always use `{}`.** Same for `else`, `for`, `while`, and `do`—never omit braces for single-line bodies.
- **Never use `any`.** Use proper types for all props, state, and function signatures.
- **Components**: Use arrow functions for component definitions (e.g. `export const MyComponent = (props: Props) => { ... }`). Do not use `React.FC` or function declarations.
- **Never use non-null assertion (`!`).** Use optional chaining, nullish coalescing (`??`), or explicit checks instead.
- **Omit redundant return types.** Do not add an explicit return type annotation when the compiler can infer it from the return expression (e.g. prefer `getFoo() { return this.x ?? null; }` over `getFoo(): SomeType[] | null { return this.x ?? null; }`). Add return types only when needed for public API clarity or when inference would be wrong or unclear.
- **No nested ternaries.** Use `if`/`else` or extract to a variable or helper so each branch is clear. A single ternary is fine; nesting (e.g. `a ? b ? c : d : e`) is not.
- **No barrel files.** Do not add `index.ts` (or `index.tsx`) files that re-export from other modules. Import directly from the target module file (e.g. `from "src/components/PlanCard/PlanCardStructure.component"` instead of `from "src/components/PlanCard"`).
- **Absolute imports (`src/…`).** Import application TypeScript and JavaScript modules with paths rooted at `src/` (e.g. `import { compact } from "src/utils/array.helpers"`, `import { useFoo } from "src/hooks/useFoo.hook"`). Do not use relative paths (`./`, `../`) to reach another module under `src/` unless an exception below applies.
- **Exceptions to absolute imports:** (1) **CSS Modules** and other static assets co-located with the importing file (e.g. `import styles from "./MyComponent.module.css"`). (2) **`src/contentful/types/`**—these files are generated; do not hand-edit their import style.
- **Do not re-export types (or values) from another module.** Types and constants should be imported from the module that defines them. Do not add `export type { X } from "other/module"` (or similar re-exports) in a file just so consumers can import from a single place; have consumers import from the defining module (e.g. `CommercialKwhTier` from `src/models/offerTiers`, not from `CommercialOffer`). In particular, never re-export types from a component file (e.g. `export type { AnimatedProps, ContentProps } from "./MyComponent.types"`); consumers that need those types must import from the types file (e.g. `from "src/components/MyComponent/MyComponent.types"`).
- **Use a single params object for function parameters.** For model methods, API methods, and any function that takes more than one argument or an optional argument, pass a single object parameter (e.g. `getDisplayPriceFromPrices({ locale, preferredKwh })`, `formatPricePerKwh({ price, locale })`) so call sites are self-documenting and order-independent. Define an interface for the params in the same file when it helps.
- **Contentful types**: Content types are generated into `src/contentful/types/` (run `pnpm types:contentful` with Contentful env vars set). Use those generated types and the **parsed** types from `src/contentful/parse*.ts` in components. Do not edit generated types by hand.
- **Contentful ordering**: Do not sort or alphabetize Contentful data in the app. Order at fetch time via the Contentful API `order` parameter (e.g. in getters). Do not use `alphabetize()` or `.sort()` on arrays that came from Contentful.
- **App-level types**: Shared slugs, navigation IDs, and similar **constants** live in [src/utils/constants.ts](../../src/utils/constants.ts). Feature-scoped interfaces and types live under [src/interfaces/](../../src/interfaces/) (e.g. [common.interfaces.ts](../../src/interfaces/common.interfaces.ts)). Prefer colocating types with a feature when they are not cross-cutting.
- **API and forms**: When adding new API or form payloads, define interfaces in the relevant module, next to [src/api/urls.ts](../../src/api/urls.ts), or alongside the route handler under `src/app/api/`.
- **Site constants**: App-wide slugs, Contentful entry IDs used as fixed references, and similar **data constants** belong in [src/utils/constants.ts](../../src/utils/constants.ts) (or a dedicated constants module under `src/utils/` if the list grows), not scattered as magic strings. Use `src/utils/` for functions and helpers; use named constants for shared immutable values (and small URL builders that only compose those constants).

## React / JSX

We favor plain functions with typed props—no `React.FC`—and explicit conditionals so we never accidentally render a stray `0` or `false`.

- **Component types**: Do not use `FC` or `React.FC`. Type props explicitly (e.g. `const MyComponent = ({ foo }: MyProps) => { ... }`) and let the return type be inferred.
- **Conditional components**: Use a ternary (`condition ? <Component /> : null`) instead of short-circuit (`condition && <Component />`) so the render branch is explicit and avoids accidentally rendering falsy values (e.g. `0`). Write conditionals as multi-line statement blocks—put each branch on its own line(s) rather than a single-line ternary.
- **Multiple or conditional class names**: Use the `classnames` package (import as `classNames`) instead of template literals or string concatenation. Prefer **object notation** for conditionals: `classNames(styles.a, { [styles.active]: isActive })` rather than `classNames(styles.a, isActive ? styles.active : "")`. For static lists use multiple arguments: `classNames(styles.a, styles.b)`. When accepting an optional `className` prop: `classNames(styles.container, className)`. This keeps conditional and combined classes consistent and avoids manual `.trim()` or `?? ""`.
- **Raster images in UI**: Use **`next/image`** (`import Image from "next/image"`). Avoid bare **`<img>`** for content images unless you have a rare, documented exception. Every `Image` needs an **`alt`**; rules and remote hosts are in **Accessibility** below.

### Large components and state

- **Extract state into a custom hook when a component has many state items.** If a component uses several `useState`/`useEffect` calls and many derived values (e.g. booleans, computed styles), move that logic into a dedicated hook (e.g. `useMyComponentState`) in the same folder. The hook should accept the minimal props/data it needs and return a single object of state and derived values. The main component file stays focused on composition and JSX; the hook file owns the state and effects.

## Formatting and linting

We standardize on **Biome** for both lint and format (no ESLint in this repo).

- **Braces**: Always use curly braces `{}` for control flow (`if`, `else`, `for`, `while`, etc.), even for single-line bodies. Use statement blocks for all conditionals and early returns—no single-line `if` bodies or single-line returns (e.g. `if (!x) { return null; }` not `if (!x) return null`).
- **Commands**:
  - `pnpm lint` – check only
  - `pnpm format` – format and write
  - `pnpm lint:fix` – run `biome check --write` (fix what can be fixed)
- **Config**: [biome.json](../../biome.json). CSS is included (formatter and linter).
- **Notable rules**: no unused imports/variables, no inferrable types (annotate where Biome requires), use `as const` where appropriate, `noDangerouslySetInnerHtml` is a warning.
- Run lint/format before committing so CI (e.g. `pnpm lint:ci`) passes.

## CSS and styling

### Technology choice

- **Components use CSS Modules** (`.module.css`) co-located with the component.

### File naming and location

Place the CSS module next to the component, e.g. `MyComponent.component.tsx` and `MyComponent.module.css`. In the component, import the module and use the class names object (e.g. `styles.wrapper`, `styles.primaryButton`).

### Modern CSS

- **Nesting**: Use nesting for scoped styles and for nested media queries. Examples: [src/components/HeroSlide/HeroSlide.module.css](../../src/components/HeroSlide/HeroSlide.module.css), [src/components/Section/Section.module.css](../../src/components/Section/Section.module.css).
- **Custom properties**: Prefer variables from the global design system. All design tokens (colours, spacing, typography, theme overrides) live in [src/styles/variables.css](../../src/styles/variables.css), which is imported by `globals.css`. Prefer these over hard-coded colors and sizes where tokens exist.
- **Runtime font variables**: Next.js `localFont` injects `--font-arida` and `--font-area` via a class on `<html>` at runtime. Do not declare them in CSS. They are registered as known properties for Stylelint in [`src/styles/runtime-variables.json`](../../src/styles/runtime-variables.json), which is listed in the `importFrom` array in `stylelint.config.ts`.
- **Modern features**: Use `color-mix()`, `clamp()` for responsive typography and spacing where they simplify code. Keep styles DRY by reusing variables and, when needed, component-level custom properties.

### Mobile-first

Write base styles for mobile; then override or add rules for larger viewports.

- **In CSS**: Use standard media queries (e.g. `@media (min-width: 800px)`, `@media (min-width: 1120px)`). Do not use `@custom-media`; it is unreliable.
- **In JS/TS**: Prefer keeping media queries in CSS modules. If a query truly must live in JS, keep breakpoints consistent with the design system and colocate the values with the feature or a small shared style helper.

### Style rules

- **Alphabetize** CSS properties within each rule block.
- **Nest** selectors where it makes sense (`&:hover`, `&.active`, `& .child`), but **avoid deep nesting**. If a block has many nested rules (e.g. a root class with five or more descendant blocks), break it into separate top-level rules using the full selector (e.g. `.table .tableCell { }` instead of nesting `.tableCell` inside `.table`). Keep nesting to one level for structure; use flat rules for clarity.
- **Spacing**: Do not use `margin-top`. Prefer flexbox with `gap` for vertical and horizontal spacing between siblings (e.g. `display: flex; flex-direction: column; gap: var(--sizing-1)`).
- Do not add redundant comments in CSS; class names and structure should be self-explanatory.

## Testing

Tests use Jest, **page objects** for setup, and **`screen` / `userEvent`** in the spec itself for queries and clicks. That split keeps flaky setup in one place and leaves assertions easy to read.

### Page object pattern

- **Base class**: [src/tests/basePageObject.po.ts](../../src/tests/basePageObject.po.ts) (optional `debug`, `raiseOnFind`).
- **Per-component page object**: In `<Name>.po.tsx`, define a class that extends `BasePageObject`, sets `testId = "rh<ComponentName>"`, implements `render<Name>()` using the custom `render` from test-utils, and exposes setup/actions only. Do not add getter functions or methods that wrap `screen.getBy*` / `screen.queryBy*`; the page object holds test data and setup only.
- **Tests**: In `<Name>.spec.tsx`, instantiate the page object in `beforeEach`, call its setup and render methods, then use **`screen` and `userEvent` directly** in the test file for all queries and interactions (e.g. `expect(screen.getByText(po.offer.title)).toBeInTheDocument()`, `await userEvent.click(screen.getByTestId("rhPlanCardHeader"))`).
- **Custom render**: Always use the `render` from [testUtils.tsx](../../src/tests/testUtils.tsx). It wraps the tree with the same providers as the app (see that file). Global styles load via [src/styles/globals.css](../../src/styles/globals.css).

### Test data

- **Rosie factories** (e.g. `<Name>.factory.ts`) are used for complex props in tests and page objects. Define a factory when it reduces duplication.
- **Use factories for structured test data.** When a factory exists for a type, use `.build({ ... })` with overrides instead of inline objects. Override only the fields that matter for the test; let the factory supply the rest.
- **Use Faker for all factories.** Import `faker` from `@faker-js/faker` and use it for dynamic values (ids, strings, numbers, dates, etc.). Use function attrs (e.g. `id: () => faker.number.int()`) so each build gets fresh data. Keep only true constants as static attrs (enums, empty strings, null). Tests that need specific values override with `.build({ field: value })`.

### Jest and `next/script`

Unit tests that assert on DOM from **`next/script`** (e.g. JSON-LD `<script id="schema-structured-data">`) should **mock** `next/script` so injection is synchronous; the real component loads `afterInteractive` and can leave stale nodes or miss timing in JSDOM.

- **Shared mock**: Add a small module under `src/tests/mocks/` that renders a plain `<script>` with the same `id`, `type`, and children when you need this pattern.
- **Wiring**: Jest only auto-resolves manual mocks from the repo-root `__mocks__` tree; mocks under `src/tests/mocks/` need an **explicit factory**:

```ts
jest.mock("next/script", () => ({
  __esModule: true,
  default: require("src/tests/mocks/yourNextScriptMock").default,
}));
```

## Test IDs

- Every component that is tested (or likely to be) should have a **root element** with `data-testid="rh<ComponentName>"` (e.g. `rhAddressLookup`, `rhContentCard`). Use PascalCase to match the component name.
- The page object’s `testId` property must match so that `screen.getByTestId(this.testId)` finds the root.
- Do not use generic or non-standard test IDs for the component root.

## Accessibility

Ship UI that works with a keyboard and a screen reader whenever the design allows. These bullets are the baseline; product and design may ask for more in specific flows.

- Use **semantic HTML** first: correct heading levels, `<button>` for actions, `<a>` / `Link` for navigation, lists for list content.
- **Forms**: Associate every input with a label (`htmlFor` / `id`) or an accessible name via `aria-label` / `aria-labelledby` when design has no visible label.
- **Images**: **`alt` is required on every `Image`**—accurate text from Contentful (or the right source) when the image conveys information; **`alt=""`** when it is purely decorative so assistive tech can skip it. Pair that with **`next/image`** (see React / JSX above) for optimization. If you introduce a **new external image hostname**, add it to **`images.remotePatterns`** in [`next.config.ts`](../../next.config.ts); Contentful and the existing allow-listed hosts are already there.
- **Keyboard**: Interactive controls must be focusable and operable without a pointer; overlays and mobile menus should not leave focus in a hidden layer.
- **Motion**: Prefer honoring **`prefers-reduced-motion`** for large or looping animations when it is straightforward to do so.

## Comments

Avoid redundant comments. Prefer clear names and small, focused functions so that intent is obvious. Add comments only when explaining non-obvious behavior, workarounds, or business rules that are not evident from the code.

## Editor

The repo uses [.editorconfig](../../.editorconfig): indent 2 spaces, UTF-8, insert final newline, trim trailing whitespace. Respect this so diffs stay clean.

## React Query

Keep data-fetching hooks in their own files under `src/hooks/queries/` and `src/hooks/mutations/`. Components should call a named hook and react to `data`, `isLoading`, and `isError`—not own the `useQuery` wiring inline.

- **Always create a dedicated query hook file.** Do not inline `useQuery` (or `useMutation`) in components. Add hooks under `src/hooks/queries/` (when you add client queries) and `src/hooks/mutations/` (e.g. [useSendContactEmailApi.mutation.ts](../../src/hooks/mutations/useSendContactEmailApi.mutation.ts)) and import them where needed.
- **Hook params must be a single object.** Pass one argument object to the hook instead of multiple positional arguments. Define an interface for the params in the same file when it helps.
- **Keep query hooks dumb.** Query files should only call `useQuery` (or `useMutation`) with `queryKey`, `queryFn`, `enabled`, `select`, etc. Do not add side effects (e.g. `useEffect`), error callbacks (`onError`), or success callbacks (`onSuccess`) in the query file.
- **Handle errors and side effects at the call site.** Where the query is used (e.g. in a component), read `isError` and `error` from the result and run any `useEffect` or callbacks there (logging, reporting, toasts, etc.).
