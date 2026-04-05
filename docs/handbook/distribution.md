# Sitemaps and public output

This chapter describes how **sitemap XML** is produced and written for crawlers.

## XML sitemaps

- **Helpers**: [src/lib/generateSitemap.ts](../../src/lib/generateSitemap.ts) — `generateSitemap`, **`outputSitemap(routes, filename)`**, `SitemapItem` with `route` and `modTime` (use when generating sitemaps from code that has explicit routes and dates).
- **Build**: After `next build`, **`make sitemap`** runs [scripts/make_sitemap.js](../../scripts/make_sitemap.js), which reads **`.next/prerender-manifest.json`** and writes **`public/sitemap.xml`** with the prerendered route set (see [package.json](../../package.json) `build` script).
- **Discovery**: Root layout links **`/sitemap-index.xml`** in `<head>` when that file is served (adjust if your deployment uses only `sitemap.xml`).

When you add **routes that must appear in search indexes**, confirm they show up in the prerender manifest or extend the sitemap pipeline accordingly.

## Robots and metadata

- **Robots**: [src/app/robots.ts](../../src/app/robots.ts) defines robots behavior for the App Router.
- **Manifest / social**: See `manifest.ts`, `opengraph-image`, and related files under `src/app/` for PWA and sharing metadata.
