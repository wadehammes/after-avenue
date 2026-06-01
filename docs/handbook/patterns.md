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
