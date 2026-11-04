"use client";

import { type ComponentType, type ReactNode, Suspense, use } from "react";
import { browser } from "react-dom";

export type BrowserLazyDefaultProps<P extends object> = P & {
  modulePromise: Promise<{ default: ComponentType<P> }>;
  suspenseFallback?: ReactNode;
};

type BrowserLazyInnerProps<P extends object> = P & {
  modulePromise: Promise<{ default: ComponentType<P> }>;
};

const BrowserLazyInner = <P extends object>(
  props: BrowserLazyInnerProps<P>,
) => {
  const { modulePromise, ...rest } = props;
  use(browser());
  const DefaultExport = use(modulePromise).default;

  return <DefaultExport {...(rest as P)} />;
};

export const BrowserLazyDefault = <P extends object>(
  props: BrowserLazyDefaultProps<P>,
) => {
  const { modulePromise, suspenseFallback, ...playerProps } = props;

  return (
    <Suspense fallback={suspenseFallback ?? null}>
      <BrowserLazyInner modulePromise={modulePromise} {...(playerProps as P)} />
    </Suspense>
  );
};
