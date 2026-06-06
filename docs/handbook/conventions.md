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
- **Components**: Use arrow functions for component definitions (e.g. `export const MyComponent = (props: Props) => { ... }`). Do not use `React.FC` / `FC` or `function` declarations.
- **Never use non-null assertion (`!`).** Use optional chaining, nullish coalescing (`??`), or explicit checks instead.
- **Omit redundant return types.** Do not add an explicit return type annotation when the compiler can infer it from the return expression (e.g. prefer `getFoo() { return this.x ?? null; }` over `getFoo(): SomeType[] | null { return this.x ?? null; }`). Add return types only when needed for public API clarity or when inference would be wrong or unclear.
- **No nested ternaries.** Use `if`/`else` or extract to a variable or helper so each branch is clear. A single ternary is fine; nesting (e.g. `a ? b ? c : d : e`) is not.
- **No barrel files.** Do not add `index.ts` (or `index.tsx`) files that re-export from other modules. Import directly from the target module file (e.g. `from "src/components/PlanCard/PlanCardStructure.component"` instead of `from "src/components/PlanCard"`).
- **Absolute imports (`src/…`).** Import application TypeScript and JavaScript modules with paths rooted at `src/` (e.g. `import { compact } from "src/utils/array.helpers"`, `import { useFoo } from "src/hooks/useFoo.hook"`). Do not use relative paths (`./`, `../`) to reach another module under `src/` unless an exception below applies.
- **Exceptions to absolute imports:** (1) **CSS Modules** and other static assets co-located with the importing file (e.g. `import styles from "./MyComponent.module.css"`). (2) **`src/contentful/types/`**—these files are generated; do not hand-edit their import style.
- **Do not re-export types (or values) from another module.** Types and constants should be imported from the module that defines them. Do not add `export type { X } from "other/module"` (or similar re-exports) in a file just so consumers can import from a single place; have consumers import from the defining module (e.g. `CommercialKwhTier` from `src/models/offerTiers`, not from `CommercialOffer`). In particular, never re-export types from a component file (e.g. `export type { AnimatedProps, ContentProps } from "./MyComponent.types"`); consumers that need those types must import from the types file (e.g. `from "src/components/MyComponent/MyComponent.types"`).
- **Use a single params object for function parameters.** For model methods, API methods, and any function that takes more than one argument or an optional argument, pass a single object parameter (e.g. `getDisplayPriceFromPrices({ locale, preferredKwh })`, `formatPricePerKwh({ price, locale })`) so call sites are self-documenting and order-independent. Define an interface for the params in the same file when it helps.
- **Use semantic parameter and variable names.** Pick a name that describes what the value *is* — its domain meaning, format, or source — not its lifecycle state. Avoid generic placeholders like `raw`, `data`, `val`, `tmp`, `result`, `thing`. Prefer `encodedValue`, `cookieString`, `metadataEntry`, `apiResponse`, `candidateSlug`, `trimmedDescription`. The same rule applies to local `const`s, not just parameters. Built-in JS APIs that use these names (e.g. `String.raw`) are obviously fine.
- **Contentful types**: Content types are generated into `src/contentful/types/` (run `pnpm types:contentful` with Contentful env vars set). Use those generated types and the **parsed** types from `src/contentful/parse*.ts` (e.g. `ContentCardType`, types from `parseSections.ts`) in components. Do not edit generated types by hand.
- **Contentful ordering**: Do not sort or alphabetize Contentful data in the app. Order at fetch time via the Contentful API `order` parameter (e.g. in `getWork`, `getEditors`, `getPages`). Do not use `alphabetize()` or `.sort()` on arrays that came from Contentful.
- **App-level types**: Shared interfaces and type aliases live under [src/interfaces/](../../src/interfaces/) (e.g. [common.interfaces.ts](../../src/interfaces/common.interfaces.ts)). Cross-cutting utility types (e.g. [KeysMatch.ts](../../src/types/KeysMatch.ts)) live under `src/types/`. Prefer colocating types with a feature when they are not cross-cutting.
- **API and forms**: When adding new API or form payloads, define interfaces in the relevant module or alongside [src/api/urls.ts](../../src/api/urls.ts).
- **Site constants**: App-wide slugs, Contentful entry IDs used as fixed references, and similar **data constants** belong in [src/utils/constants.ts](../../src/utils/constants.ts), not scattered as magic strings. Use `src/utils/` for functions and helpers; use named constants for shared immutable values (and small URL builders that only compose those constants).

## React / JSX

We favor plain functions with typed props—no `React.FC`—and explicit conditionals so we never accidentally render a stray `0` or `false`.

- **Component types**: Do not use `FC` or `React.FC`. Type props explicitly (e.g. `const MyComponent = ({ foo }: MyProps) => { ... }`) and let the return type be inferred.
- **Conditional components**: Use a ternary (`condition ? <Component /> : null`) instead of short-circuit (`condition && <Component />`) so the render branch is explicit and avoids accidentally rendering falsy values (e.g. `0`). Write conditionals as multi-line statement blocks—put each branch on its own line(s) rather than a single-line ternary.
- **Multiple or conditional class names**: Use the `classnames` package (import as `classNames`) instead of template literals or string concatenation. For **conditional** classes, use **object notation**: `classNames(styles.a, { [styles.active]: isActive })` (avoid `isActive && styles.active` and avoid ternaries that return class strings). For static lists use multiple arguments: `classNames(styles.a, styles.b)`. When accepting an optional `className` prop: `classNames(styles.container, className)`. This keeps conditional and combined classes consistent and avoids manual `.trim()` or `?? ""`.
- **Raster images in UI**: Use **`next/image`** (`import Image from "next/image"`). Avoid bare **`<img>`** for content images unless you have a rare, documented exception. Every `Image` needs an **`alt`**; rules and remote hosts are in **Accessibility** below.
- **Links**: Use **`next/link`**'s **`Link`** for all navigational links—internal paths, external URLs, **`mailto:`**, **`tel:`**, and the like—not a bare **`<a>`** unless you have a rare, documented exception. Pass **`href`**; for new tabs, set **`target`** and **`rel`** (e.g. **`noopener noreferrer`**). See [components.md](components.md#links).

### Large components and state

- **Extract state into a custom hook when a component has many state items.** If a component uses several `useState`/`useEffect` calls and many derived values (e.g. booleans, computed styles), move that logic into a dedicated hook (e.g. `useMyComponentState`) in the same folder. The hook should accept the minimal props/data it needs and return a single object of state and derived values. The main component file stays focused on composition and JSX; the hook file owns the state and effects. Example: [ContactForm.component.tsx](../../src/components/ContactForm/ContactForm.component.tsx) (form state and submission wiring).

## Formatting and linting

We standardize on **Biome** for both lint and format of TS/JS/JSON/CSS, plus **Stylelint** for CSS-specific rules (custom-property usage, deprecated properties, modern media-query syntax). No ESLint in this repo.

- **Braces**: Always use curly braces `{}` for control flow (`if`, `else`, `for`, `while`, etc.), even for single-line bodies. Use statement blocks for all conditionals and early returns—no single-line `if` bodies or single-line returns (e.g. `if (!x) { return null; }` not `if (!x) return null`).
- **Commands**:
  - `pnpm lint` – Biome `check` (no writes)
  - `pnpm lint:fix` – Biome `check --fix` (fix what can be fixed)
  - `pnpm lint:changed` – Biome `check --fix` scoped to files changed since `origin/main` (fast pre-push pass)
  - `pnpm lint:css` – Stylelint check only (matches `**/*.css`)
  - `pnpm lint:css:fix` – Stylelint with `--fix`
  - `pnpm lint:all` – `pnpm lint:changed` then `pnpm lint:css:fix`
- **Config**: [biome.json](../../biome.json) for Biome (CSS formatter and linter included); [stylelint.config.ts](../../stylelint.config.ts) for Stylelint.
- **Notable Biome rules**: no unused imports/variables, no inferrable types (annotate where Biome requires), use `as const` where appropriate, `noDangerouslySetInnerHtml` is a warning.
- **Stylelint** extends `stylelint-config-standard` + `stylelint-config-css-modules` and runs the `csstools/value-no-unknown-custom-properties` plugin, which validates every `var(--…)` against [`src/styles/variables.css`](../../src/styles/variables.css) and [`src/styles/runtime-variables.json`](../../src/styles/runtime-variables.json). Properties injected at render time (inline style, `<style>` tags, Next.js font classes on `<html>`, or set on a parent rule) must be registered so Stylelint recognizes them—either as `--name: initial;` in CSS or in `runtime-variables.json`.
- Run lint/format before committing so CI (e.g. `pnpm lint:ci`) passes.

## CSS and styling

### Technology choice

- **Components use CSS Modules** (`.module.css`) co-located with the component.

### File naming and location

Place the CSS module next to the component, e.g. `MyComponent.component.tsx` and `MyComponent.module.css`. In the component, import the module and use the class names object (e.g. `styles.wrapper`, `styles.primaryButton`).

### Modern CSS

- **Nesting**: Use nesting for scoped styles and for nested media queries. Examples: [src/components/HeroSlide/HeroSlide.module.css](../../src/components/HeroSlide/HeroSlide.module.css), [src/components/Section/Section.module.css](../../src/components/Section/Section.module.css).
- **Custom properties**: Use variables from the global design system. They are defined in [src/styles/variables.css](../../src/styles/variables.css) on `:root`, e.g. `var(--colors-purple-main)`, `var(--font-size-standard)`, `var(--sizing-1)`. Prefer these over hard-coded colors and sizes. If you need to inject a custom property at render time (inline `style={{ "--foo": value }}`, `<style>` tag, or set on a parent rule), declare it in the same file as `--foo: initial;` or add it to [`runtime-variables.json`](../../src/styles/runtime-variables.json) so Stylelint recognizes it.
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

Tests use Jest, **page objects** for **render setup, mocks, and shared test data only**. **Do not call `screen` / `queryBy*`** from page objects—put all DOM queries in **`<Name>.spec.tsx`** via **`screen`**, **`userEvent`**, and **`within`** as needed. The PO may still expose **`testId`**, fixed strings used in renders (e.g. accordion body copy), or small helpers that return **non-DOM** values (e.g. expected modal title text).

### Page object pattern

- **Base class**: [src/tests/basePageObject.po.ts](../../src/tests/basePageObject.po.ts) (optional `debug`, `raiseOnFind`).
- **Per-component page object**: In `<Name>.po.tsx`, define a class (e.g. `ContactFormPageObject`) that extends `BasePageObject`, sets `testId = "rh<ComponentName>"`, implements `render<ComponentName>()` using the custom **`render`** from test-utils, and holds test data and setup (factories, `jest.resetAllMocks()`, mock implementations, `render` options). See [ContactForm.po.tsx](../../src/components/ContactForm/ContactForm.po.tsx).
- **Tests**: In `<Name>.spec.tsx`, import **`describe`**, **`it`**, **`expect`**, **`beforeEach`**, and **`afterEach` from `@jest/globals`** so TypeScript sees **jest-dom** matchers such as **`toBeInTheDocument`**. Instantiate the page object in **`beforeEach`**, call its setup and render methods, then query the DOM with **`screen`** / **`userEvent`** (e.g. **`expect(screen.getByTestId(po.testId)).toBeInTheDocument()`**, **`expect(screen.getByText("Thanks for reaching out.")).toBeInTheDocument()`**).
- **Custom render**: Always use the `render` from [test-utils.tsx](../../src/tests/test-utils.tsx). It wraps the tree with RouterContext, QueryClientProvider, and any providers the component under test needs (e.g. `GlobalVariablesProvider` in [ContactForm.po.tsx](../../src/components/ContactForm/ContactForm.po.tsx)). Global styles (design tokens and reset) are loaded via `src/styles/globals.css` when needed.
- **Examples**: [ContactForm/](../../src/components/ContactForm/) (API call site + reCAPTCHA mocks), [DeployButton/](../../src/components/DeployButton/) (mutation call site), [StyledButton/](../../src/components/StyledButton/) (render-only).

### Test data

- **`BaseFactory` factories** (e.g. `<Name>.factory.ts`) are used for complex props in tests and page objects. Each factory subclasses [`BaseFactory`](../../src/tests/factories/BaseFactory.ts) and is exported as a singleton instance. Define a factory when it reduces duplication. **All factories live in [`src/tests/factories/`](../../src/tests/factories/)**—never next to the component. Factories are shared test infrastructure (multiple POs and specs import them; nested factories compose each other) and grouping them in one folder makes that surface easy to find and avoids circular imports between component-co-located factories.
- **Use factories for structured test data.** When a factory exists for a type (e.g. `styledButtonFactory`), use `.build({ ... })` with overrides instead of inline objects. Override only the fields that matter for the test; let the factory supply the rest.
- **Factory shape.** Each factory declares its own `<Name>FactoryOptions` type (use `Record<string, never>` when no options are needed) and implements `build(attributes?, _options?)`. Inside `build`, construct an `instance` literal with `satisfies <Type>`, then return `{ ...instance, ...(attributes ?? {}) }`. Include the [`KeysMatch`](../../src/types/KeysMatch.ts) guard (`const _allKeysMustBeInTheInstance: KeysMatch<Type, typeof instance> = undefined;`) so missing keys—required _or_ optional—break the build instead of silently shipping `undefined`.
- **One factory per file.** Each `<Name>.factory.ts` under [`src/tests/factories/`](../../src/tests/factories/) exports exactly one factory singleton, and the filename matches the singleton (e.g. `StyledButton.factory.ts` → `styledButtonFactory`). When two related factories compose, split them into two files and have the composite import from the leaf, not co-locate. A grep on `factory.ts` should land on exactly one factory; specs that need both import each by name from their own module.
- **Every key gets random Faker data—no exceptions.** Required, optional, nullable—every property in the `instance` literal must be a `faker.*` call (or a `faker.helpers.arrayElement([...])` for unions/enums), not a hard-coded string, number, `null`, or `undefined`. Even optional fields are populated by default so tests start from a realistic, fully-formed object and so two builds never collide on the same id/title. Tests that specifically need `null` / `undefined` / a fixed value must override with `.build({ field: null })`.
- **For nullable fields (`T | null`), use [`nullish`](../../src/utils/factory.helpers.ts).** `nullish([value])` randomly returns `null` or the provided value, so factory output exercises both branches across builds and keeps consumers honest about handling `null`. Tests that need a non-null value (or specifically `null`) must override at the call site.
- **Cast enum sample arrays to the type, not `as const`.** When you hand-list values for a Contentful union, cast the array as `Type[]` rather than freezing it with `as const`. The cast keeps the parsed/generated type as the source of truth—if a member is removed from `src/contentful/types/`, the factory string fails to compile—while a frozen tuple silently mirrors stale values.
- **Use nested factories for compound shapes.** If a type contains a `Document` (rich text), a `Cta`, a `ContentfulAsset`, etc., reach for the existing factory instead of inlining a literal. This applies in **page objects too**: when a PO overrides a rich-text field, build through the document factory and only inline the blocks the test needs—do not write the outer wrapper by hand. When you find yourself hand-writing the same nested object in more than one factory or PO, lift it into its own `<Name>.factory.ts` under [`src/tests/factories/`](../../src/tests/factories/).
- **Function wrappers are unnecessary.** Each call to `.build()` runs the body fresh, so write `id: faker.string.uuid()` directly—no `() => faker.string.uuid()` wrappers like the old Rosie API required.
- **Explicitly set any field the test queries or asserts on.** If a spec finds an element by a factory-driven string (e.g. `getByLabelText(inputLabel)`, `getByRole("button", { name: buttonText })`) or asserts on one, pass that value to `.build({ inputLabel: "Enter ZIP code", buttonText: "See plans" })` and use the **literal string** in the query/assertion. Do not read it back via `po.metadata.field` and do not use `?? "fallback"` to paper over the type's nullability — the literal makes the test intent obvious and decoupled from faker defaults.
- **Repeat the literal in the PO and the spec; do not share via a constant.** When the same string appears in a `.build({ ... })` call in the page object and a `screen.getByText(...)` / assertion in the spec, write the literal in both places. Do not extract it into an `export const FOO = "..."` (in either file) and import it in both. Sharing the constant hides the *coupling* the test is asserting (changing the literal in one place silently keeps the spec passing), removes the visible value from the assertion site (the reader has to chase the import to know what the test is checking), and creates an export with no production consumer. Two identical literals separated by file is the desired state — the duplication is the point.

### What to mock (and what not to)

Default to running **in-repo utilities** for real in component tests — both thin wrappers and substantive pure helpers (e.g. `appendUrlParams`, `convertRelativeUrl`, `parseUrlParams`, string/format helpers in `src/utils/*`). Stubbing them hides what the component actually produces, leaks implementation details into tests, and means a refactor of the utility silently breaks the test contract.

- **Don't mock**: anything under [`src/utils/`](../../src/utils/) — URL builders, URL param parsers, string helpers, etc. Let them run.
- **Do mock**: external dependencies — `src/api/*` calls, `next/router`, `next/script` (see below), `next/dynamic`, third-party widgets such as `react-google-recaptcha`, `IntersectionObserver`, and similar.
- **Mocking `src/api/urls` in page objects**: wire `jest.mock("src/api/urls")` in the **PO file** (not the spec), export `mockApi`, and use [`mockApiResponse`](../../src/tests/mocks/mockApiResponse.ts) for success/failure setup helpers (e.g. `setupMockSuccess()` / `setupMockFailure()`). See [ContactForm.po.tsx](../../src/components/ContactForm/ContactForm.po.tsx) and [DeployButton.po.tsx](../../src/components/DeployButton/DeployButton.po.tsx).
- **API layer unit tests**: colocate specs next to the API modules ([helpers.spec.ts](../../src/api/helpers.spec.ts), [urls.spec.ts](../../src/api/urls.spec.ts)) and mock `global.fetch` there—not in component specs.
- **Assertions**: compute the expected value by calling the real helper in the spec (e.g. `expect(href).toBe(appendUrlParams(enrollOffersUrl(), "", ""))`), or use `toContain` with a stable substring when downstream side-effects would otherwise force coupling to internals. Both are fine; pick whichever keeps the test legible.
- **Wiring assertions**: drop `expect(mockedHelper).toHaveBeenCalledWith(...)` style checks when un-mocking — the final output already proves the wiring.

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

Other third-party mocks follow the same pattern—e.g. [`mockGoogleRecaptcha.tsx`](../../src/tests/mocks/mockGoogleRecaptcha.tsx) for `react-google-recaptcha`. [`mockNextDynamic.ts`](../../src/tests/mocks/mockNextDynamic.ts) is wired globally in [`.jest/setupTests.ts`](../../.jest/setupTests.ts) as a passthrough for `next/dynamic`.

### React Email templates

Email templates under [`src/emails/`](../../src/emails/) are **not** page objects. Test them with Testing Library in `*.spec.tsx` beside the template (see [ContactFormEmails.spec.tsx](../../src/emails/ContactFormEmails.spec.tsx)). For [renderContactEmails.tsx](../../src/emails/renderContactEmails.tsx), **mock** `react-email`’s `render` in the spec—do not invoke the real `@react-email/render` in Jest. See [patterns.md → Transactional email](patterns.md#transactional-email-react-email).

## Test IDs

- Every component that is tested (or likely to be) should have a **root element** with `data-testid="rh<ComponentName>"` (e.g. `rhAddressLookup`, `rhContentCard`). Use PascalCase to match the component name.
- The page object’s **`testId`** must match the component root **`data-testid`** so specs can use **`screen.getByTestId(po.testId)`**.
- Do not use generic or non-standard test IDs for the component root.

## Accessibility

Ship UI that works with a keyboard and a screen reader whenever the design allows. These bullets are the baseline; product and design may ask for more in specific flows.

- Use **semantic HTML** first: correct heading levels, `<button>` for actions, **`Link` from `next/link`** for navigation, lists for list content.
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

- **Always create a dedicated query hook file.** Do not inline `useQuery` (or `useMutation`) in components. Add hooks under `src/hooks/queries/` (when you add client queries) and `src/hooks/mutations/` (e.g. [useSubmitContactFormMutation.ts](../../src/hooks/mutations/useSubmitContactFormMutation.ts)) and import them where needed.
- **Hook params must be a single object.** Pass one argument object to the hook instead of multiple positional arguments. Define an interface for the params in the same file when it helps.
- **Keep query hooks dumb.** Query files should only call `useQuery` (or `useMutation`) with `queryKey`, `queryFn`, `enabled`, `select`, etc. Do not add side effects (e.g. `useEffect`), error callbacks (`onError`), or success callbacks (`onSuccess`) in the query file.
- **Handle errors and side effects at the call site.** Where the query is used (e.g. in a component), read `isError` and `error` from the result and run any `useEffect` or callbacks there (logging, reporting, toasts, etc.).
