import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFeaturedReelMedia } from "src/components/FeaturedWork/useFeaturedReelMedia";
import { createMutedPlayerHandlers } from "src/utils/videoPlayerConfig";

interface UseFeaturedWorkReelPlayerOptions {
  shouldPlay: boolean;
  workVideoUrl?: string;
}

export const useFeaturedWorkReelPlayer = (
  options: UseFeaturedWorkReelPlayerOptions,
) => {
  const { shouldPlay, workVideoUrl } = options;
  const embedRef = useRef<HTMLDivElement>(null);
  const [isVideoReady, setIsVideoReady] = useState(false);

  const { onError, onReady, remountKey } = useFeaturedReelMedia({
    active: shouldPlay,
    containerRef: embedRef,
  });

  useEffect(() => {
    setIsVideoReady(false);
  }, [remountKey, workVideoUrl]);

  const markEmbedVisible = useCallback(() => {
    setIsVideoReady(true);
  }, []);

  const handleEmbedReady = useCallback(() => {
    markEmbedVisible();
    onReady();
  }, [markEmbedVisible, onReady]);

  const muteHandlers = useMemo(() => {
    const handlers = createMutedPlayerHandlers(embedRef, handleEmbedReady, {
      invokeReadyOnStart: false,
    });

    return {
      ...handlers,
      onStart: () => {
        handlers.onStart();
        markEmbedVisible();
      },
    };
  }, [handleEmbedReady, markEmbedVisible]);

  const playerKey = `${workVideoUrl ?? ""}-${remountKey}`;

  return {
    embedRef,
    isVideoReady,
    muteHandlers,
    onError,
    playerKey,
  };
};
