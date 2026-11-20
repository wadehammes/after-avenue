import {
  type RefObject,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import { findEmbedMediaElement } from "src/utils/videoPlayerConfig";

const PAUSE_WHEN_OFF_SCREEN_MS = 300;

interface MediaElement {
  pause: () => Promise<void> | void;
  play: () => Promise<void>;
}

interface UseFeaturedReelMediaOptions {
  active: boolean;
  embedContainerRef?: RefObject<HTMLElement | null>;
  embedEventsEnabled?: boolean;
  getMediaElement: () => MediaElement | null;
  onEmbedCanPlay?: () => void;
}

const attachEmbedLifecycleListeners = (
  embed: Element,
  onLoadComplete: () => void,
  onPlaying: () => void,
): (() => void) => {
  const onLoadCompleteHandler = () => {
    onLoadComplete();
  };
  const onPlayingHandler = () => {
    onPlaying();
  };

  embed.addEventListener("loadcomplete", onLoadCompleteHandler);
  embed.addEventListener("playing", onPlayingHandler);

  return () => {
    embed.removeEventListener("loadcomplete", onLoadCompleteHandler);
    embed.removeEventListener("playing", onPlayingHandler);
  };
};

export const useFeaturedReelMedia = (options: UseFeaturedReelMediaOptions) => {
  const {
    active,
    embedContainerRef,
    embedEventsEnabled = false,
    getMediaElement,
    onEmbedCanPlay,
  } = options;
  const hasNotifiedCanPlayRef = useRef(false);
  const pauseDelayRef = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const [hasStartedPlayback, setHasStartedPlayback] = useState(false);

  const syncPlayback = useCallback(
    (shouldPlay: boolean) => {
      const mediaElement = getMediaElement();
      if (!mediaElement) {
        return;
      }

      if (!shouldPlay) {
        void Promise.resolve(mediaElement.pause()).catch(() => {});
        return;
      }

      void mediaElement.play().catch(() => {});
    },
    [getMediaElement],
  );

  const handleEmbedPlaying = useEffectEvent(() => {
    if (active) {
      syncPlayback(true);
    }

    setHasStartedPlayback(true);

    if (!onEmbedCanPlay || hasNotifiedCanPlayRef.current) {
      return;
    }

    hasNotifiedCanPlayRef.current = true;
    onEmbedCanPlay();
  });

  const handleEmbedLoadComplete = useEffectEvent(() => {
    if (active) {
      syncPlayback(true);
    }
  });

  useEffect(() => {
    if (active) {
      clearTimeout(pauseDelayRef.current);
      syncPlayback(true);
      return;
    }

    pauseDelayRef.current = setTimeout(() => {
      syncPlayback(false);
    }, PAUSE_WHEN_OFF_SCREEN_MS);

    return () => {
      clearTimeout(pauseDelayRef.current);
    };
  }, [active, syncPlayback]);

  useEffect(() => {
    if (!embedEventsEnabled || !embedContainerRef) {
      return;
    }

    const container = embedContainerRef.current;
    if (!container) {
      return;
    }

    let detachListeners: (() => void) | undefined;

    const tryAttach = () => {
      if (detachListeners) {
        return;
      }

      const embed = findEmbedMediaElement(container);
      if (!embed) {
        return;
      }

      detachListeners = attachEmbedLifecycleListeners(
        embed,
        handleEmbedLoadComplete,
        handleEmbedPlaying,
      );
    };

    tryAttach();

    const observer = new MutationObserver(() => {
      tryAttach();
    });
    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      detachListeners?.();
    };
  }, [embedContainerRef, embedEventsEnabled]);

  const onError = useCallback(() => {
    if (active) {
      syncPlayback(true);
    }
  }, [active, syncPlayback]);

  return {
    hasStartedPlayback,
    onError,
    onMediaReady: () => {
      syncPlayback(active);
    },
  };
};
