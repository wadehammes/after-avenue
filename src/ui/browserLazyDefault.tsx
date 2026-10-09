"use client";

import { type ComponentType, type ReactNode, Suspense, use } from "react";
import { browser } from "react-dom";

type BrowserLazyProps<P extends object> = P & {
  suspenseFallback?: ReactNode;
};

export const createBrowserLazyDefault = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
) => {
  const modulePromise = importFn();

  const BrowserLazyInner = (props: P) => {
    use(browser());
    const DefaultExport = use(modulePromise).default;

    return <DefaultExport {...props} />;
  };

  const BrowserLazyDefault = (props: BrowserLazyProps<P>) => {
    const { suspenseFallback, ...playerProps } = props;

    return (
      <Suspense fallback={suspenseFallback ?? null}>
        <BrowserLazyInner {...(playerProps as P)} />
      </Suspense>
    );
  };

  return BrowserLazyDefault;
};
