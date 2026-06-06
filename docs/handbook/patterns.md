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

## Layout and page structure

- **Root layout**: [src/app/layout.tsx](../../src/app/layout.tsx) loads global styles, providers, navigation, and footer data.
- **Page shells**: Feature pages compose **PageComponent**, **SectionRenderer**, or dedicated page components with CSS Modules.

## Metadata and JSON-LD

- **Metadata**: Use `generateMetadata` / `metadata` exports on layouts and pages per [Next.js Metadata](https://nextjs.org/docs/app/building-your-application/optimizing/metadata) conventions.
- **JSON-LD**: [JsonLd.component.tsx](../../src/components/JsonLd/JsonLd.component.tsx) renders a `application/ld+json` script. Graph builders live in [src/lib/schema.ts](../../src/lib/schema.ts).

## Dynamic imports

Use **`next/dynamic`** for code-splitting when a component is heavy or must be client-only. See [components.md](components.md).

## Embedded video (Vimeo / YouTube)

Work entries store a **`workVideoUrl`** (Vimeo or YouTube). The site plays them through **[`react-player`](https://github.com/cookpete/react-player)** behind our shared **[`VideoPlayer`](../../src/components/VideoPlayer/VideoPlayer.component.tsx)** wrapper. Treat every embed as expensive: one iframe per mount, heavy on scroll and memory if you mount many at once.

### `VideoPlayer` (shared wrapper)

- **Client-only**: `"use client"`; **`react-player`** is loaded with **`next/dynamic`** and **`ssr: false`**.
- **Props**:
  - **`autoPlay`** + **`playInView`** — when both are true, playback starts (with a short debounce when `playInView` toggles). Pause is immediate when `playInView` becomes false.
  - **`controls`** — user-facing players (work detail, cards with controls).
  - **`light`** — ReactPlayer preview/thumbnail mode; **no full embed until the user clicks**. Use for non-autoplay lists.
  - **`rounded`** — 20px radius on the shell (cards).
- **Loading UX**: Keep the embed at full opacity. Cover it with a **dot-pattern overlay** that fades out on **`onReady`**. Do **not** hide the embed with `opacity: 0` while waiting for autoplay — browsers block playback on invisible media and the player can deadlock.
- **Light mode**: Skip the overlay while the thumbnail is showing; show the overlay only after **`onClickPreview`** while the full player loads.

### Where each pattern is used

| Surface | Component | Strategy |
|---------|-----------|----------|
| Home featured reels (desktop) | [`FeaturedWork`](../../src/components/FeaturedWork/FeaturedWork.component.tsx) | **`useInView`** with **`triggerOnce: true`**, **`rootMargin: "150px 0px"`** — mount **`VideoPlayer`** once when near the viewport; **`autoPlay`** + **`playInView`**. Mobile uses **`WorkCard`**. |
| Work index / category / related cards | [`WorkCard`](../../src/components/WorkCard/WorkCard.component.tsx) | **`useInView`** with **`triggerOnce: false`** — mount near viewport (**`150px`** margin), **unmount when scrolled away**. **`light={!autoPlay}`** so grids show thumbnails until play. Entrance animation runs once via **`onChange`**. |
| Work detail hero | [`WorkEntryPage`](../../src/components/WorkEntryPage/WorkEntryPage.component.tsx) | Single **`VideoPlayer`** with **`controls`**; may use **`playInView`** from the `?playVideo=true` query. |
| Editors index hover background | [`EditorsBackgroundVideo`](../../src/components/EditorsBackgroundVideo/EditorsBackgroundVideo.component.tsx) | **Single active player.** On hover (150ms debounce in [`EditorsPage`](../../src/components/EditorsPage/EditorsPage.component.tsx)), show the **static MP4** prominently while a **hidden preload** `ReactPlayer` loads the next embed; swap to the embed on **`onReady`**. Only one visible player at a time. |

### Performance rules

1. **Never mount one `ReactPlayer` per list item** on a long page. Lazy-mount, use **`light`** for click-to-play grids, or use a **fixed-size player pool** (editors background).
2. **Keep `rootMargin` modest** (~**150px**) on multi-column grids. Large margins (e.g. **400px**) intersect many cards at once and defeat lazy loading.
3. **Prefer `triggerOnce: true`** when a card should load once and stay mounted (home featured). Use **`triggerOnce: false`** only when you intentionally **unmount** off-screen players to free memory (work grid).
4. **Do not toggle scale/opacity on scroll** in sync with play/pause — it causes scroll jank. Run entrance animation **once** (CSS **`animation`**, not a class that flips on every intersection).
5. **Reserve space** — video containers use **16∶9** padding (or **`aspect-ratio`**) and the dot-pattern placeholder so layout does not shift while the chunk loads.

### Intersection observers

List and card deferral uses **`react-intersection-observer`** (**`useInView`**). Jest tests mock **`IntersectionObserver`** via [`setupIntersectionObserverMock`](../../src/tests/mocks/mockIntersectionObserver.ts) in [setupTests.ts](../../.jest/setupTests.ts).

### Network hints

Root layout preconnects Vimeo CDN hosts — see [layout.tsx](../../src/app/layout.tsx). CSP allowlists for YouTube/Vimeo are in [next.config.ts](../../next.config.ts).
