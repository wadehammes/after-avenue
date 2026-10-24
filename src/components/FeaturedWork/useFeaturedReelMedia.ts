import { useCallback, useEffect, useState } from "react";

interface MediaElement {
  pause: () => Promise<void> | void;
  play: () => Promise<void>;
}

interface UseFeaturedReelMediaOptions {
  active: boolean;
  mediaElement: MediaElement | null;
}

export const useFeaturedReelMedia = (options: UseFeaturedReelMediaOptions) => {
  const { active, mediaElement } = options;
  const [remountKey, setRemountKey] = useState(0);

  useEffect(() => {
    if (!mediaElement) {
      return;
    }

    if (!active) {
      void Promise.resolve(mediaElement.pause()).catch(() => {});
      return;
    }

    void mediaElement.play().catch(() => {});
  }, [active, mediaElement]);

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
    remountKey,
  };
};
