"use client";

import dynamic from "next/dynamic";
import {
  type ComponentProps,
  forwardRef,
  type ReactNode,
  Suspense,
} from "react";
import type ReactPlayer from "react-player";

const ReactPlayerDynamic = dynamic(() => import("react-player"), {
  ssr: false,
});

export type LazyReactPlayerProps = ComponentProps<typeof ReactPlayer> & {
  loadingFallback?: ReactNode;
};

export const LazyReactPlayer = forwardRef<
  HTMLVideoElement,
  LazyReactPlayerProps
>(function LazyReactPlayer(props, ref) {
  const { loadingFallback, ...playerProps } = props;

  const player = <ReactPlayerDynamic ref={ref} {...playerProps} />;

  if (loadingFallback) {
    return <Suspense fallback={loadingFallback}>{player}</Suspense>;
  }

  return player;
});
