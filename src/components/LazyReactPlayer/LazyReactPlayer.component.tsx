"use client";

import type { ComponentProps, ReactNode } from "react";
import type ReactPlayer from "react-player";
import { createBrowserLazyDefault } from "src/ui/browserLazyDefault";

const ReactPlayerLazy = createBrowserLazyDefault(() => import("react-player"));

export type LazyReactPlayerProps = ComponentProps<typeof ReactPlayer> & {
  loadingFallback?: ReactNode;
};

export const LazyReactPlayer = (props: LazyReactPlayerProps) => {
  const { loadingFallback, ...playerProps } = props;

  return (
    <ReactPlayerLazy {...playerProps} suspenseFallback={loadingFallback} />
  );
};
