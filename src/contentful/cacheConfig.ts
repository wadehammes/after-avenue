import safeJsonStringify from "safe-json-stringify";

const ONE_DAY_SECONDS = 60 * 60 * 24;

/**
 * Production deployments: no time-based revalidation (on-demand / webhooks only).
 * Preview, local dev, and other non-production contexts: revalidate after one day.
 */
const isProductionDeployment = (): boolean => {
  return (
    process.env.VERCEL_ENV === "production" ||
    process.env.ENVIRONMENT === "production"
  );
};

/**
 * For `unstable_cache` only. Do not import into `page.tsx` / `layout.tsx` for
 * `export const revalidate` — Next.js requires an inline expression there; see
 * `src/app/layout.tsx` (keep values in sync).
 */
export const CONTENTFUL_CACHE_REVALIDATE: number | false =
  isProductionDeployment() ? false : ONE_DAY_SECONDS;

export function sanitizeForCache<T>(value: T): T {
  return safeJsonStringify.ensureProperties(value) as T;
}
