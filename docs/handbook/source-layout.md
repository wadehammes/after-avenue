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

## `src/lib/`

Server- and shared-oriented modules:

- [generateSitemap.ts](../../src/lib/generateSitemap.ts) — sitemap XML generation
- [schema.ts](../../src/lib/schema.ts) — JSON-LD / schema.org helpers
- [analytics.ts](../../src/lib/analytics.ts) — client analytics helpers ([integrations.md](integrations.md))

## `src/contentful/`

Client, getters, parsers, generated types — see [contentful.md](contentful.md).

## `src/app/`

App Router routes, layouts, and Route Handlers — see [architecture.md](architecture.md).
