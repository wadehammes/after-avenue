# Source layout reference

Use this page when you know what you want to do (“add a constant”, “find the sitemap helper”) but not which folder it lives in.

## `src/interfaces/`

Feature-scoped TypeScript contracts (e.g. [common.interfaces.ts](../../src/interfaces/common.interfaces.ts)). Prefer **colocating** types with a single feature when they are not shared across the app.

## `src/utils/`

Helpers are **split by topic**—there is no barrel `utils/index.ts`. Import the module you need directly (see [conventions.md](conventions.md) on barrel files).

| Area | Files (examples) |
|------|------------------|
| **Constants** | [constants.ts](../../src/utils/constants.ts) — slugs, navigation IDs, build exclusions |
| **General helpers** | [helpers.ts](../../src/utils/helpers.ts) — `envUrl`, `createImageUrl`, guards |
| **Style** | [styleHelpers.ts](../../src/utils/styleHelpers.ts) |
| **Spam / rate limits** | [spamDetection.ts](../../src/utils/spamDetection.ts), [rateLimit.ts](../../src/utils/rateLimit.ts) |
| **reCAPTCHA** | [recaptcha.ts](../../src/utils/recaptcha.ts) |

Specs: `*.spec.ts` next to modules (e.g. [rateLimit.spec.ts](../../src/utils/rateLimit.spec.ts)).

## `src/api/`

Client-side HTTP entry points for components and React Query hooks:

| File | Purpose |
|------|---------|
| [urls.ts](../../src/api/urls.ts) | `api` object — contact email, HubSpot, deploy hooks, etc. |
| [helpers.ts](../../src/api/helpers.ts) | `postJson`, `fetchResponse`, `FetchMethods` |
| [helpers.spec.ts](../../src/api/helpers.spec.ts) / [urls.spec.ts](../../src/api/urls.spec.ts) | Unit tests (mock `global.fetch`) |

See [patterns.md](patterns.md#api-layer-and-route-handlers).

## `src/hooks/`

| Folder | Purpose |
|--------|---------|
| **`mutations/`** | React Query mutation hooks (e.g. [useSubmitContactFormMutation.ts](../../src/hooks/mutations/useSubmitContactFormMutation.ts), [useDeployHookMutation.ts](../../src/hooks/mutations/useDeployHookMutation.ts)). **No spec files here**—test component call sites instead. |
| **`queries/`** | Add when you introduce client-side `useQuery` hooks. |

## `src/tests/`

Shared test infrastructure (see [conventions.md](conventions.md#testing)):

| Path | Purpose |
|------|---------|
| [test-utils.tsx](../../src/tests/test-utils.tsx) | Custom `render` with React Query + router; re-exports `userEvent` |
| [basePageObject.po.ts](../../src/tests/basePageObject.po.ts) | Base class for page objects |
| [factories/BaseFactory.ts](../../src/tests/factories/BaseFactory.ts) | Faker test factories (e.g. [StyledButton.factory.ts](../../src/tests/factories/StyledButton.factory.ts)) |
| [mocks/mockApiResponse.ts](../../src/tests/mocks/mockApiResponse.ts) | Success/failure helpers for mocked `api` endpoints |
| [mocks/mockGoogleRecaptcha.tsx](../../src/tests/mocks/mockGoogleRecaptcha.tsx) | Invisible reCAPTCHA ref mock for component tests |
| `mocks/` | Jest doubles for router, `matchMedia`, `IntersectionObserver`, etc. |

## `src/lib/`

Server- and shared-oriented modules:

- [generateSitemap.ts](../../src/lib/generateSitemap.ts) — sitemap XML generation
- [schema.ts](../../src/lib/schema.ts) — JSON-LD / schema.org helpers

## `src/contentful/`

Client, getters, parsers, generated types — see [contentful.md](contentful.md).

## `src/components/` (video)

| Path | Purpose |
|------|---------|
| [VideoPlayer/](../../src/components/VideoPlayer/) | Shared `react-player` wrapper — loading overlay, `light` preview, `playInView` debounce. |
| [WorkCard/](../../src/components/WorkCard/) | Work grid card; lazy-mount video near viewport. |
| [FeaturedWork/](../../src/components/FeaturedWork/) | Home featured work block (desktop video). |
| [EditorsBackgroundVideo/](../../src/components/EditorsBackgroundVideo/) | `/editors` hover background; two-player pool. |

Patterns and performance rules: [patterns.md → Embedded video](patterns.md#embedded-video-vimeo--youtube).

## `src/emails/`

React Email templates for transactional mail (contact form today). Full flow and design rules: [patterns.md → Transactional email](patterns.md#transactional-email-react-email).

| File | Purpose |
|------|---------|
| [EmailLayout.tsx](../../src/emails/EmailLayout.tsx) | Shared HTML shell (panel, logo, footer). |
| [emailStyles.ts](../../src/emails/emailStyles.ts) | Shared colors and inline `CSSProperties`. |
| [emailLogo.ts](../../src/emails/emailLogo.ts) / [emailBrandmark.ts](../../src/emails/emailBrandmark.ts) | Base64 image constants. |
| [ContactFormEmail.interfaces.ts](../../src/emails/ContactFormEmail.interfaces.ts) | Props shared by both contact templates. |
| [previewProps.ts](../../src/emails/previewProps.ts) | Sample data for preview. |
| [renderContactEmails.tsx](../../src/emails/renderContactEmails.tsx) | `render()` wrappers for the Route Handler. |
| `ContactForm*Email.tsx` | Individual templates (`export default` + `PreviewProps` for preview UI). |
| `*.spec.tsx` | Template RTL tests and mocked render-helper tests. |

Preview locally:

```bash
pnpm email:dev
```

Opens `http://localhost:3006` (separate from `pnpm dev` on port 3005).

## `src/app/`

App Router routes, layouts, and Route Handlers — see [architecture.md](architecture.md).
