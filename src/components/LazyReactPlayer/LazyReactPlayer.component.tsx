"use client";

import dynamic from "next/dynamic";
import { type ComponentProps, type ReactNode, Suspense } from "react";
import type ReactPlayer from "react-player";

const ReactPlayerDynamic = dynamic(() => import("react-player"), {
  ssr: false,
});

export type LazyReactPlayerProps = ComponentProps<typeof ReactPlayer> & {
  loadingFallback?: ReactNode;
};

export const LazyReactPlayer = (props: LazyReactPlayerProps) => {
  const { loadingFallback, ...playerProps } = props;

  const player = <ReactPlayerDynamic {...playerProps} />;

  if (loadingFallback) {
    return <Suspense fallback={loadingFallback}>{player}</Suspense>;
  }

  return player;
};
