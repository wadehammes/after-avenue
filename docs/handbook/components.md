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

Use **`next/dynamic`** when a component is heavy but still safe to SSR. For most **browser-only** dependencies (`window`, third-party widgets), use **`createBrowserLazyDefault`](../../src/ui/browserLazyDefault.tsx) (**`browser()`** + **`use()`** + **`Suspense`**) per [conventions.md → React 19.3](conventions.md#react-193-client-only-code-and-refs). CMS-driven pieces are imported directly in **ContentRenderer** today; if a block becomes large enough to defer, wrap it with `dynamic` there or in the parent.

**Embedded video**: Always render **`react-player`** through [`LazyReactPlayer`](../../src/components/LazyReactPlayer/LazyReactPlayer.component.tsx) (**`next/dynamic`**, `ssr: false`—see [conventions.md](conventions.md)). Toggle playback with **`playing`**; use **`autoPlay`** only as a **static** mount-time hint (e.g. priority home reel, editors background) — never flip **`autoPlay`** when **`playing`** changes. Optional **`loadingFallback`** wraps the player in **`Suspense`**. See [patterns.md → Embedded video](patterns.md#embedded-video-vimeo--youtube).

**Contact reCAPTCHA**: [`ContactFormReCaptcha`](../../src/components/ContactForm/ContactFormReCaptcha.component.tsx) loads **`react-google-recaptcha`** via **`createBrowserLazyDefault`** (not **`next/dynamic`**).

## Video-related components

| Component | Role |
|-----------|------|
| [`LazyReactPlayer`](../../src/components/LazyReactPlayer/LazyReactPlayer.component.tsx) | Client-only **`react-player`** wrapper (`next/dynamic`). Use everywhere instead of a direct import. |
| [`WorkHeroVideo`](../../src/components/WorkHeroVideo/WorkHeroVideo.component.tsx) | Work detail hero — controls, solid loading overlay until ready, `playing` prop. |
| [`WorkCard`](../../src/components/WorkCard/WorkCard.component.tsx) | Work grid / home mobile — **`light`** poster, lazy-mount via `useInView` (`VIDEO_MOUNT_ROOT_MARGIN`), custom play chrome until playback starts. |
| [`WorkPagePrefetch`](../../src/components/WorkPage/WorkPagePrefetch.component.tsx) | Client helper on `/work` — `import("react-player")` warmup for the grid. |
| [`FeaturedWork`](../../src/components/FeaturedWork/FeaturedWork.component.tsx) | Home featured reel (desktop) — mount when in view (priority on load); `playing={playInView}` from [`useFeaturedReelInView`](../../src/components/FeaturedWork/useFeaturedReelInView.ts); scroll entrance via [`scrollEntrance.module.css`](../../src/styles/scrollEntrance.module.css). |
| [`EditorsBackgroundVideo`](../../src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component.tsx) | Fixed full-viewport background for `/editors` (desktop); **two-player pool** — active embed stays mounted; static MP4 + hidden preload on hover; swap on **`onReady`**. |

## Shared form and feedback UI

Reusable pieces live **outside** a single feature folder when more than one form needs them:

| Location | Role |
|----------|------|
| [Input/](../../src/components/Input/), [TextArea/](../../src/components/TextArea/), [Checkbox/](../../src/components/Checkbox/) | Base UI + react-hook-form field wrappers for labels, errors, and refs (React 19 `ref` prop). |
| [forms/FormWebsiteHoneypot.component.tsx](../../src/components/forms/FormWebsiteHoneypot.component.tsx) | Honeypot `website` field for bot traps. |
| [Toast/ToastHost.component.tsx](../../src/components/Toast/ToastHost.component.tsx) | App-wide toast viewport; mounted from [providers.tsx](../../src/app/providers.tsx). |
| [ui/Field/FieldErrorMessage.component.tsx](../../src/ui/Field/FieldErrorMessage.component.tsx) | Shared error line under controls. |

### ContactForm (reference feature folder)

[ContactForm/](../../src/components/ContactForm/) shows how a CMS-backed form composes the shared pieces above:

- **Types** — [contactForm.schema.ts](../../src/lib/forms/contactForm.schema.ts) exports **`ContactFormValues`**, **`contactFormApiSchema`**, and **`hubspotLeadApiSchema`**. Route Handlers, [urls.ts](../../src/api/urls.ts), and mutation hooks import types from that module (not the component file).
- **Validation** — `createContactFormSchema` + `zodResolver`; field messages are colocated in the component (`FORM_MESSAGES`). react-hook-form **`mode: "onBlur"`**; aggregate “missing required fields” copy stays in the feature CSS module.
- **Layout CSS** — Shared shell classes from [formLayoutShared.module.css](../../src/styles/formLayoutShared.module.css) (`form`, submit row, honeypot placement). Feature-only styles (success panel, etc.) stay in [ContactForm.module.css](../../src/components/ContactForm/ContactForm.module.css).
- **Fields** — `Controller` + [Input](../../src/components/Input/Input.component.tsx) / [TextArea](../../src/components/TextArea/TextArea.component.tsx); optional [Checkbox](../../src/components/Checkbox/Checkbox.component.tsx) when **`globalVariables.contactFormMarketingConsentText`** is set. [FormWebsiteHoneypot](../../src/components/forms/FormWebsiteHoneypot.component.tsx) + invisible reCAPTCHA (`getRecaptchaSiteKey()` from [publicEnv.ts](../../src/utils/publicEnv.ts)).
- **Submit** — [useSubmitContactFormMutation](../../src/hooks/mutations/useSubmitContactFormMutation.ts); API/reCAPTCHA failures → **`appToast.error`**. On success, set local **`submitted`** state and **`reset()`** the form, then render **`globalVariables.contactFormSuccessMessage`** (do not rely on `isSubmitSuccessful` after reset). Deeper flow: [patterns.md → Forms](patterns.md#forms).

## Links

- Use **`next/link`**'s **`Link`** for all links—same-site routes, external URLs, **`mailto:`**, **`tel:`**, and so on. Pass **`href`**. For links that open in a new tab, set **`target`** and **`rel="noopener noreferrer"`** (or equivalent) on **`Link`** as needed.
