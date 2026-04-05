# Platform, CI, and environment

This page covers **CI**, **env vars**, **draft preview**, and **`src/proxy.ts`**.

## Continuous integration

PRs that target **`staging`** run [`.github/workflows/ci.yml`](../../.github/workflows/ci.yml):

1. Checkout
2. **pnpm** + **Node** from [`.tool-versions`](../../.tool-versions)
3. **`pnpm install`**
4. **`pnpm tsc:ci`** — TypeScript strict
5. **`pnpm lint:ci`** — Biome in CI reporter mode
6. **`pnpm test:ci`** — Jest

Run **`pnpm tsc:ci`**, **`pnpm lint:ci`**, and **`pnpm test:ci`** locally before pushing when you touch types, lint, or tests.

## Package scripts (local workflow)

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Next dev server on port 3005 (see root README). |
| `pnpm build` / `pnpm start` | Production build and serve (`build` runs `make sitemap`). |
| `pnpm build:analyze` | Bundle analysis (see package.json). |
| `pnpm lint` / `pnpm lint:fix` / `pnpm format` | Biome (same family as `lint:ci`). |
| `pnpm test:ci` | Jest (CI-style). |
| `pnpm scaffold` | New component folder under `src/components/` (see [components.md](components.md)). |
| `pnpm types:contentful` | Regenerate `src/contentful/types` (needs CMA env vars). |

The full list lives in **[`package.json`](../../package.json)**.

## Environment variables and `next.config`

**[`next.config.ts`](../../next.config.ts)** lists env vars exposed to the app under `env: { ... }`. If a name is not listed, the client bundle will not see it. Keep secrets off `NEXT_PUBLIC_*`.

Configure values in **Vercel** (or your host) and mirror locally via `npx vercel env pull` as described in the root README.

Notable groups:

- **Contentful** — space, delivery/preview tokens, preview secret, CMA token for codegen.
- **ENVIRONMENT** — drives URLs in helpers such as [envUrl()](../../src/utils/helpers.ts).
- **HubSpot, Resend, reCAPTCHA** — used by Route Handlers and forms.

## Preview and draft mode

Draft mode uses App Router APIs:

- **Enable draft**: [src/app/api/draft/route.ts](../../src/app/api/draft/route.ts) checks `previewSecret` against **`CONTENTFUL_PREVIEW_SECRET`**, enables draft mode, then redirects.
- **Disable draft**: [src/app/api/disable-draft/route.ts](../../src/app/api/disable-draft/route.ts).
- **Preview content**: Getters accept `preview: true` and use the preview client from [client.ts](../../src/contentful/client.ts).

## `src/proxy.ts`

[src/proxy.ts](../../src/proxy.ts) attaches **`x-pathname`** to request headers for downstream use. If you add **Next.js middleware**, import and call `proxy` from there so the behavior is actually applied on each request; otherwise verify whether this helper is referenced anywhere before assuming headers are set.
