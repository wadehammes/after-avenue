import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { getPlayerMediaElement } from "src/utils/videoPlayerConfig";

const PLAYBACK_SYNC_MAX_FRAMES = 15;
const PAUSE_WHEN_INACTIVE_MS = 200;

interface UseFeaturedReelMediaOptions {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
}

export const useFeaturedReelMedia = (options: UseFeaturedReelMediaOptions) => {
  const { active, containerRef } = options;
  const [remountKey, setRemountKey] = useState(0);
  const activeRef = useRef(active);
  const wasActiveRef = useRef(false);
  const playbackSyncFrameRef = useRef<number | null>(null);
  const hasHandledInitialRemountEffectRef = useRef(false);

  activeRef.current = active;

  const playWhenReady = useCallback(() => {
    if (playbackSyncFrameRef.current !== null) {
      cancelAnimationFrame(playbackSyncFrameRef.current);
      playbackSyncFrameRef.current = null;
    }

    let frames = 0;

    const attempt = () => {
      playbackSyncFrameRef.current = null;

      if (!activeRef.current) {
        return;
      }

      const mediaElement = getPlayerMediaElement(containerRef.current);

      if (mediaElement) {
        void mediaElement.play().catch(() => {});
        return;
      }

      if (frames >= PLAYBACK_SYNC_MAX_FRAMES) {
        return;
      }

      frames += 1;
      playbackSyncFrameRef.current = requestAnimationFrame(attempt);
    };

    attempt();
  }, [containerRef]);

  const pauseIfLoaded = useCallback(() => {
    const mediaElement = getPlayerMediaElement(containerRef.current);

    if (!mediaElement || (mediaElement.readyState ?? 0) === 0) {
      return;
    }

    void Promise.resolve(mediaElement.pause()).catch(() => {});
  }, [containerRef]);

  useEffect(() => {
    return () => {
      if (playbackSyncFrameRef.current !== null) {
        cancelAnimationFrame(playbackSyncFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (active && !wasActiveRef.current) {
      wasActiveRef.current = true;
      playWhenReady();
      return;
    }

    if (!active && wasActiveRef.current) {
      wasActiveRef.current = false;
      const timeoutId = window.setTimeout(() => {
        if (!activeRef.current) {
          pauseIfLoaded();
        }
      }, PAUSE_WHEN_INACTIVE_MS);

      return () => {
        window.clearTimeout(timeoutId);
      };
    }
  }, [active, pauseIfLoaded, playWhenReady]);

  useEffect(() => {
    if (!hasHandledInitialRemountEffectRef.current) {
      hasHandledInitialRemountEffectRef.current = true;
      return;
    }

    if (activeRef.current) {
      playWhenReady();
    }
  }, [playWhenReady, remountKey]);

  const onReady = useCallback(() => {
    if (activeRef.current) {
      playWhenReady();
    }
  }, [playWhenReady]);

  const onError = useCallback(() => {
    setRemountKey((attempt) => {
      if (attempt >= 1) {
        return attempt;
      }

      return attempt + 1;
    });
  }, []);

  return {
    onError,
    onReady,
    remountKey,
  };
};
