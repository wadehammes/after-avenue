# Patterns

This chapter collects **cross-cutting patterns**: how App Router pages load data, how client hooks call Route Handlers, forms, and where SEO metadata lives.

## Server Components and data loading

`page.tsx` files under `src/app/` are **Server Components** by default unless marked with `"use client"`.

- **Contentful**: Call getters from `src/contentful/` (e.g. `fetchPage`, `fetchNavigation`) with `{ preview }` derived from `draftMode()` when you need draft content.
- **Serialization**: Next.js must receive serializable props when passing data from Server to Client Components. Replace `undefined` with `null` where needed; follow existing helpers if the repo adds a shared serializer.
- **Not found**: Use `notFound()` from `next/navigation` when Contentful returns no page for a slug.

## React Query — mutations

Mutation hooks live in **`src/hooks/mutations/`**.

- Each hook uses `useMutation` with a `mutationFn` that calls **api** methods from [src/api/urls.ts](../../src/api/urls.ts).
- Do not scatter raw `fetch` in components; use a mutation (or query) hook that delegates to the `api` object so URLs and request shape stay consistent.
- **Examples**: [useSubmitContactFormMutation.ts](../../src/hooks/mutations/useSubmitContactFormMutation.ts), [useDeployHookMutation.ts](../../src/hooks/mutations/useDeployHookMutation.ts).
- **Testing**: Do not add spec files for hooks in `src/hooks/queries/` or `src/hooks/mutations/`. Test the components that call them and the [API layer](../../src/api/urls.spec.ts) instead.

## React Query — queries

When you add client-side queries, place them under **`src/hooks/queries/`**, use a stable **`queryKey`**, and call through `src/api/urls.ts` inside `queryFn`. Follow the hook rules in [conventions.md](conventions.md) (single params object, no side effects in the hook file).

## API layer and Route Handlers

- **Client**: [src/api/urls.ts](../../src/api/urls.ts) is the front door for browser-initiated HTTP calls (same-origin Route Handlers and approved external hooks such as Vercel deploy URLs). All JSON POSTs go through [postJson](../../src/api/helpers.ts); use [fetchResponse](../../src/api/helpers.ts) when parsing a `Response` body.
- **Server**: Implement behavior in **`src/app/api/<name>/route.ts`** (POST/GET as needed), validate input, and return `Response` JSON with appropriate status codes.
- **Do not call `fetch` in components.** Use a React Query hook whose `mutationFn` (or `queryFn`) delegates to the `api` object.
- **Tests**: [helpers.spec.ts](../../src/api/helpers.spec.ts) and [urls.spec.ts](../../src/api/urls.spec.ts) unit-test the API layer with mocked `fetch`. Components that use the API are tested via page objects (see [conventions.md](conventions.md#what-to-mock-and-what-not-to)).

## Forms

- **Library**: react-hook-form is used where complex forms exist (e.g. [ContactForm](../../src/components/ContactForm/ContactForm.component.tsx)).
- **Submit**: Call a mutation hook (e.g. [useSubmitContactFormMutation.ts](../../src/hooks/mutations/useSubmitContactFormMutation.ts)), which chains `api` methods. Handle errors at the call site with `setError` or toasts—not by re-throwing after a failed `mutateAsync`.

## Transactional email (React Email)

Contact form mail is built with **[React Email](https://react.email/)** and sent via **Resend** from [src/app/api/send-email/contact/route.ts](../../src/app/api/send-email/contact/route.ts).

### End-to-end flow

1. **Client** — [ContactForm](../../src/components/ContactForm/ContactForm.component.tsx) submits through [useSubmitContactFormMutation](../../src/hooks/mutations/useSubmitContactFormMutation.ts) → `api.sendContactEmail` in [urls.ts](../../src/api/urls.ts).
2. **Route Handler** — validates reCAPTCHA, rate limits, and spam; maps form fields to [ContactFormEmailProps](../../src/emails/ContactFormEmail.interfaces.ts).
3. **Render** — [renderContactEmails.tsx](../../src/emails/renderContactEmails.tsx) calls `render()` from `react-email` for HTML and plain-text bodies.
4. **Send** — Resend delivers an internal notification (`ContactFormSubmissionEmail`) and a user confirmation (`ContactFormConfirmationEmail`).

### Template layout (`src/emails/`)

| File | Role |
|------|------|
| [EmailLayout.tsx](../../src/emails/EmailLayout.tsx) | Shared shell — logo, soft panel, brandmark footer. |
| [emailStyles.ts](../../src/emails/emailStyles.ts) | Brand colors, typography, shared inline styles (`emailParagraph`, `emailDivider`, etc.). |
| [emailLogo.ts](../../src/emails/emailLogo.ts) / [emailBrandmark.ts](../../src/emails/emailBrandmark.ts) | Wordmark and brandmark as **base64 data URIs** (email clients do not reliably load SVG or relative URLs). |
| [previewProps.ts](../../src/emails/previewProps.ts) | Sample props for the React Email preview UI. |
| [ContactFormSubmissionEmail.tsx](../../src/emails/ContactFormSubmissionEmail.tsx) | Internal notification template. |
| [ContactFormConfirmationEmail.tsx](../../src/emails/ContactFormConfirmationEmail.tsx) | User-facing confirmation. |
| [renderContactEmails.tsx](../../src/emails/renderContactEmails.tsx) | Server-side `render()` helpers used by the Route Handler. |

### Design conventions

- **One panel** — logo, greeting, and body live inside a single rounded panel in `EmailLayout`; no bordered “form box” around the salutation.
- **Typography** — serif for greetings/sign-off, sans-serif for body copy; accent `#d78d2d` on links and field labels only.
- **Images** — keep logos inline (base64). Regenerate `emailLogo.ts` / `emailBrandmark.ts` from `src/icons/` when brand assets change (PNG via `resvg` or similar).
- **Dividers** — subtle `Hr` rules only (`appearance: none`, low-opacity top border). Type shared dividers as `CSSProperties` in `emailStyles.ts`.
- **Preview** — `pnpm email:dev` (port **3006**). Only files with a **`export default`** appear in the sidebar; attach sample data with `Component.PreviewProps` (see [previewProps.ts](../../src/emails/previewProps.ts)). Helpers like `renderContactEmails.tsx`, `EmailLayout.tsx`, and `*.interfaces.ts` are excluded automatically (no default export).

### Testing

- **Template content** — [ContactFormEmails.spec.tsx](../../src/emails/ContactFormEmails.spec.tsx) renders templates with Testing Library (`screen`, `getByText`, `getByAltText`). React Email’s `<Html>` nesting warnings in JSDOM are expected noise.
- **Render helpers** — [renderContactEmails.spec.tsx](../../src/emails/renderContactEmails.spec.tsx) **mocks** `react-email`’s `render`. Do not call the real `@react-email/render` in Jest — it requires ESM VM modules the test runner does not provide.
- **Route Handler** — test spam/rate-limit/recaptcha behavior in a dedicated route spec if you add one; keep template assertions in `src/emails/`.

## Layout and page structure

- **Root layout**: [src/app/layout.tsx](../../src/app/layout.tsx) loads global styles, providers, navigation, and footer data.
- **Page shells**: Feature pages compose **PageComponent**, **SectionRenderer**, or dedicated page components with CSS Modules.

## Metadata and JSON-LD

- **Metadata**: Use `generateMetadata` / `metadata` exports on layouts and pages per [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) conventions.
- **JSON-LD**: [JsonLd.component.tsx](../../src/components/JsonLd/JsonLd.component.tsx) renders a `application/ld+json` script. Graph builders live in [src/lib/schema.ts](../../src/lib/schema.ts).

## Dynamic imports

Use **`next/dynamic`** for code-splitting when a component is heavy or must be client-only. See [components.md](components.md).

## Embedded video (Vimeo / YouTube)

Work entries store a **`workVideoUrl`** (Vimeo or YouTube). The site plays them through **[`react-player`](https://github.com/cookpete/react-player)**. Shared embed config lives in [`videoPlayerConfig.ts`](../../src/utils/videoPlayerConfig.ts). Treat every embed as expensive: one iframe per mount, heavy on scroll and memory if you mount many at once.

### Scroll entrance (home featured reels)

Home **featured reels** use scroll-driven entrance in [scrollEntrance.module.css](../../src/styles/scrollEntrance.module.css). Each embed mounts once via **`next/dynamic`** (`ssr: false`). **`playing`** toggles from **`useInView`**; the **priority** reel also sets **`autoPlay`** (static, never toggled on scroll) and re-asserts **`playing`** in **`onReady`** so the async chunk load does not miss autoplay.

### Embed config

[`videoPlayerConfig.ts`](../../src/utils/videoPlayerConfig.ts) exports:

- **`reelPlayerConfig`** — muted autoplay reels (Vimeo `background: true`, `autopause: false`, `unmute_button: false`)
- **`editorsBackgroundPlayerConfig`** — editors index full-viewport background
- **`mutedAutoplayPlayerProps`** — `{ muted: true, volume: 0 }` spread on background/reel `ReactPlayer`s
- **`ensurePlayerMuted` / `createMutedPlayerHandlers`** — set the **`muted`** DOM attribute (react-player v3 only passes a property), plus **`muted: 1`** / **`mute: 1`** in Vimeo/YouTube embed config for the iframe URL
- **`controlsPlayerConfig`** — user-facing players with controls (work grids, work detail hero)

### `WorkHeroVideo` (work detail hero)

- **`playing`** — drives ReactPlayer **`playing`** (e.g. from **`?playVideo=true`**)
- **`rounded`** — 20px radius on the shell
- Dot-pattern **loading overlay** until **`onReady`**

### Where each pattern is used

| Surface | Component | Strategy |
|---------|-----------|----------|
| Home featured reels (desktop) | [`FeaturedWork`](../../src/components/FeaturedWork/FeaturedWork.component.tsx) + [`useFeaturedReelInView`](../../src/components/FeaturedWork/useFeaturedReelInView.ts) | **`ReactPlayer`** via **`next/dynamic`** (`ssr: false`); **`playing={inView}`** only. First reel: **`initialInView`**. Scroll entrance via [`scrollEntrance.module.css`](../../src/styles/scrollEntrance.module.css). Mobile uses **`WorkCard`**. |
| Work index / category / related cards | [`WorkCard`](../../src/components/WorkCard/WorkCard.component.tsx) | **`ReactPlayer`** directly. Lazy-mount at **`VIDEO_MOUNT_ROOT_MARGIN`** (~**80%** ahead). **`controlsPlayerConfig`**, user clicks to play. |
| Work detail hero | [`WorkEntryPage`](../../src/components/WorkEntryPage/WorkEntryPage.component.tsx) | [`WorkHeroVideo`](../../src/components/WorkHeroVideo/WorkHeroVideo.component.tsx) — **`playing`** from server prop or **`?playVideo=true`**, loading overlay until ready. |
| Editors index hover background | [`EditorsBackgroundVideo`](../../src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component.tsx) | **Single active player** on load (`autoPlay` + **`onReady`**). On hover (150ms debounce in [`EditorsPage`](../../src/components/EditorsPage/EditorsPage.component.tsx)), show the **static MP4** while a **hidden preload** `ReactPlayer` loads the next embed; swap on **`onReady`**. |

### Performance rules

1. **Never mount one `ReactPlayer` per list item** on a long page. Lazy-mount, use **`light`** for click-to-play grids, or use a **fixed-size player pool** (editors background).
2. **Work grids** use **`VIDEO_MOUNT_ROOT_MARGIN`** (~**300px**) on a **single** observer per card — early enough to load before scroll-in, without mounting the whole grid at once.
3. **Featured reels** stay mounted; **`playInView`** toggles **`playing`** without unmounting so scroll-back resumes from the same position.
4. **Do not combine scroll-driven opacity on the same node as a lazy Vimeo iframe** — use **`scrollEntrance`** on home reels only; work cards stay static to avoid flicker.
5. **Reserve space** — video containers use **16∶9** padding (or **`aspect-ratio`**) and the dot-pattern placeholder so layout does not shift while the chunk loads.

### Intersection observers

List and card deferral uses **`react-intersection-observer`** (**`useInView`**). Jest tests mock **`IntersectionObserver`** via [`setupIntersectionObserverMock`](../../src/tests/mocks/mockIntersectionObserver.ts) in [setupTests.ts](../../.jest/setupTests.ts).

### Network hints

Root layout preconnects Vimeo CDN hosts — see [layout.tsx](../../src/app/layout.tsx). CSP allowlists for YouTube/Vimeo are in [next.config.ts](../../next.config.ts).
