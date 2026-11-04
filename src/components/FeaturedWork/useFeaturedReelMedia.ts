import { useCallback, useEffect, useState } from "react";

interface MediaElement {
  pause: () => Promise<void> | void;
  play: () => Promise<void>;
}

interface UseFeaturedReelMediaOptions {
  active: boolean;
  getMediaElement: () => MediaElement | null;
}

export const useFeaturedReelMedia = (options: UseFeaturedReelMediaOptions) => {
  const { active, getMediaElement } = options;
  const [remountKey, setRemountKey] = useState(0);

  const syncPlayback = useCallback(() => {
    const mediaElement = getMediaElement();
    if (!mediaElement) {
      return;
    }

    if (!active) {
      void Promise.resolve(mediaElement.pause()).catch(() => {});
      return;
    }

    void mediaElement.play().catch(() => {});
  }, [active, getMediaElement]);

  useEffect(() => {
    syncPlayback();
  }, [syncPlayback]);

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
    onMediaReady: syncPlayback,
    remountKey,
  };
};
