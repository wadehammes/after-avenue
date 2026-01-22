"use client";

import styles from "./error.module.css";

export default function ErrorBoundary({
  error: _error,
  reset,
}: {
  // biome-ignore lint/suspicious/noShadowRestrictedNames: Next.js requires Error type
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className={styles.errorContainer}>
      <h2>Something went wrong!</h2>
      <button type="button" onClick={reset} className={styles.errorButton}>
        Try again
      </button>
    </div>
  );
}
