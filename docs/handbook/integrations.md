# Third-party integrations and client analytics

Use this chapter when changing **analytics**, **tags**, or **client-side tracking** so env and layout stay aligned with production.

## Google Analytics

- **App Router**: [src/app/layout.tsx](../../src/app/layout.tsx) can mount **`GoogleAnalytics`** from `@next/third-parties/google` when `GA_MEASUREMENT_ID` is configured (see current layout for the exact pattern).
- **Measurement ID** comes from env (wired through [next.config.ts](../../next.config.ts)).

Prefer the existing layout pattern when adding or changing measurement IDs so third-party scripts stay in one place.

## Data layer

When adding custom events, push structured payloads to **`window.dataLayer`** in client components. Keep event names consistent and colocate helpers with the feature that emits them.

## Other third parties

Before adding a new script or external loader, **grep the repo for similar env keys** and follow the existing pattern (layout, client component, or Route Handler). If a new origin is required for images or fetches, update **`images.remotePatterns`** or security headers in **`next.config.ts`** as appropriate.
