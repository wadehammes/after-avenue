import {
  type RefObject,
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
} from "react";
import {
  FEATURED_REEL_PAUSE_WHEN_OFF_SCREEN_MS,
  FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS,
} from "src/utils/constants";
import { observeEmbedLifecycle } from "src/utils/videoPlayerConfig";

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
  const playDelayRef = useRef<ReturnType<typeof setTimeout> | undefined>(
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

  const syncPlaybackIfActive = useEffectEvent(() => {
    if (active) {
      syncPlayback(true);
    }
  });

  const handleEmbedPlaying = useEffectEvent(() => {
    syncPlaybackIfActive();

    setHasStartedPlayback((started) => (started ? started : true));

    if (!onEmbedCanPlay || hasNotifiedCanPlayRef.current) {
      return;
    }

    hasNotifiedCanPlayRef.current = true;
    onEmbedCanPlay();
  });

  const handleEmbedLoadComplete = useEffectEvent(() => {
    syncPlaybackIfActive();
  });

  useEffect(() => {
    clearTimeout(pauseDelayRef.current);
    clearTimeout(playDelayRef.current);

    if (active) {
      playDelayRef.current = setTimeout(() => {
        syncPlayback(true);
      }, FEATURED_REEL_PLAY_WHEN_ON_SCREEN_MS);

      return () => {
        clearTimeout(playDelayRef.current);
      };
    }

    pauseDelayRef.current = setTimeout(() => {
      syncPlayback(false);
    }, FEATURED_REEL_PAUSE_WHEN_OFF_SCREEN_MS);

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

    return observeEmbedLifecycle(container, {
      onAttached: syncPlaybackIfActive,
      onLoadComplete: handleEmbedLoadComplete,
      onPlaying: handleEmbedPlaying,
    });
  }, [embedContainerRef, embedEventsEnabled]);

  const onError = useCallback(() => {
    if (active) {
      syncPlayback(true);
    }
  }, [active, syncPlayback]);

  return {
    hasStartedPlayback,
    onError,
  };
};
