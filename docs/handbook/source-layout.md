# Source layout reference

Use this page when you know what you want to do (“add a constant”, “find the sitemap helper”) but not which folder it lives in.

## `src/@types/`

Ambient TypeScript declarations not tied to a runtime module:

| File | Purpose |
|------|---------|
| [react.d.ts](../../src/@types/react.d.ts) | Shared React prop aliases |
| [svg.d.ts](../../src/@types/svg.d.ts) | SVGR **`src/icons/*.svg`** imports for **`pnpm tsc:ci`** / CI (gitignored **`next-env.d.ts`** alone is not enough) |

## `src/interfaces/`

Feature-scoped TypeScript contracts (e.g. [common.interfaces.ts](../../src/interfaces/common.interfaces.ts)). Prefer **colocating** types with a single feature when they are not shared across the app.

## `src/utils/`

Helpers are **split by topic**—there is no barrel `utils/index.ts`. Import the module you need directly (see [conventions.md](conventions.md) on barrel files).

| Area | Files (examples) |
|------|------------------|
| **Constants** | [constants.ts](../../src/utils/constants.ts) — slugs, navigation IDs, build exclusions, `VIDEO_MOUNT_ROOT_MARGIN` |
| **General helpers** | [helpers.ts](../../src/utils/helpers.ts) — `envUrl`, `isLocalEnvironment`, `isStagingEnvironment`, `isNonProductionContactEnvironment`, `createImageUrl`, guards |
| **Scroll entrance** | [supportsScrollTimeline.ts](../../src/utils/supportsScrollTimeline.ts) — feature detect for CSS scroll-driven fallback |
| **Style** | [styleHelpers.ts](../../src/utils/styleHelpers.ts) |
| **Spam / rate limits** | [spamDetection.ts](../../src/utils/spamDetection.ts), [rateLimit.ts](../../src/utils/rateLimit.ts) |
| **reCAPTCHA** | [recaptcha.ts](../../src/utils/recaptcha.ts) |
| **Email routing** | [emailHelpers.ts](../../src/utils/emailHelpers.ts) — non-production Resend-only contact recipients via [helpers.ts](../../src/utils/helpers.ts) **`isNonProductionContactEnvironment()`**; covered by [emailHelpers.spec.ts](../../src/utils/emailHelpers.spec.ts) |
| **Video embed config** | [videoPlayerConfig.ts](../../src/utils/videoPlayerConfig.ts) — Vimeo/YouTube configs, muted autoplay helpers (`reelPlayerConfig`, `featuredReelPlayerConfig`, `editorsBackgroundPlayerConfig`, `controlsPlayerConfig`) |
| **Public env (client)** | [publicEnv.ts](../../src/utils/publicEnv.ts) — e.g. `getRecaptchaSiteKey()` for form components |

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
| **Root-level hooks** | e.g. [useStableFieldId.ts](../../src/hooks/useStableFieldId.ts) — stable `id` / `htmlFor` wiring for form labels. |

## `src/ui/`

Small, cross-feature UI pieces that are not full `src/components/` features:

| Path | Purpose |
|------|---------|
| [Field/FieldErrorMessage.component.tsx](../../src/ui/Field/FieldErrorMessage.component.tsx) | Inline validation error under form controls. |
| [Field/FormFieldLayout.component.tsx](../../src/ui/Field/FormFieldLayout.component.tsx) | Shared label + control slot + error wrapper for Input/TextArea. |
| [browserLazyDefault.tsx](../../src/ui/browserLazyDefault.tsx) | **`createBrowserLazyDefault`** — `browser()` + dynamic `import()` + `Suspense` for client-only packages (e.g. reCAPTCHA). **`react-player`** uses [`LazyReactPlayer`](../../src/components/LazyReactPlayer/LazyReactPlayer.component.tsx) instead. |

## `src/tests/`

Shared test infrastructure (see [conventions.md](conventions.md#testing)):

| Path | Purpose |
|------|---------|
| [test-utils.tsx](../../src/tests/test-utils.tsx) | Custom `render` with React Query + router; re-exports `userEvent` |
| [basePageObject.po.ts](../../src/tests/basePageObject.po.ts) | Base class for page objects |
| [factories/BaseFactory.ts](../../src/tests/factories/BaseFactory.ts) | Faker test factories (e.g. [StyledButton.factory.ts](../../src/tests/factories/StyledButton.factory.ts)) |
| [mocks/mockApiResponse.ts](../../src/tests/mocks/mockApiResponse.ts) | Success/failure helpers for mocked `api` endpoints |
| [mocks/mockGoogleRecaptcha.tsx](../../src/tests/mocks/mockGoogleRecaptcha.tsx) | Invisible reCAPTCHA ref mock for component tests |
| [mocks/appToast.mock.ts](../../src/tests/mocks/appToast.mock.ts) | Shared `mockToast` fns for toast assertions (wired in setupTests) |
| [mocks/svgMock.tsx](../../src/tests/mocks/svgMock.tsx) | SVG imports in Jest via `jest.config` `moduleNameMapper` |
| [utils/setProcessEnv.ts](../../src/tests/utils/setProcessEnv.ts) | Assign read-only env keys (e.g. **`NODE_ENV`**) in strict TypeScript specs |
| [utils/handbookTestRules.ts](../../src/tests/utils/handbookTestRules.ts) | Static checks for handbook testing conventions (see [conventions.md → Testing](conventions.md#testing)) |
| `mocks/` | Jest doubles for router, `matchMedia`, `IntersectionObserver`, etc. |

## `src/lib/`

Server- and shared-oriented modules:

- [generateSitemap.ts](../../src/lib/generateSitemap.ts) — sitemap XML generation
- [schema.ts](../../src/lib/schema.ts) — JSON-LD / schema.org helpers
- **`forms/`** — Zod field helpers ([formFieldSchemas.ts](../../src/lib/forms/formFieldSchemas.ts), including **`contactApiFieldsSchema`** for route validation) and per-form schemas (e.g. [contactForm.schema.ts](../../src/lib/forms/contactForm.schema.ts) with **`ContactFormApiBody`** / **`HubspotLeadApiBody`**; unit-test schemas beside them).
- **`toast/`** — [appToast.ts](../../src/lib/toast/appToast.ts) facade used by components; mocked globally in Jest.

## `src/contentful/`

Client, getters, parsers, generated types — see [contentful.md](contentful.md).

## `src/components/` (video)

| Path | Purpose |
|------|---------|
| [WorkHeroVideo/](../../src/components/WorkHeroVideo/) | Work detail hero — `ReactPlayer`, loading overlay. |
| [WorkCard/](../../src/components/WorkCard/) | Work grid card; lazy-mount video near viewport. |
| [FeaturedWork/](../../src/components/FeaturedWork/) | Home featured work block (desktop video). Playback/scroll state in colocated [`useFeaturedReelInView.ts`](../../src/components/FeaturedWork/useFeaturedReelInView.ts). |
| [EditorsBackgroundVideo/](../../src/components/EditorsBackgroundVideo/) | `/editors` hover background; two-player pool. |

Patterns and performance rules: [patterns.md → Embedded video](patterns.md#embedded-video-vimeo--youtube). Shared scroll entrance styles: [scrollEntrance.module.css](../../src/styles/scrollEntrance.module.css) (import `.enter` / `.animate` on card roots).

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
