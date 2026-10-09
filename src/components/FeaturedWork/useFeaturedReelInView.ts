import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { VIDEO_MOUNT_ROOT_MARGIN } from "src/utils/constants";
import { supportsScrollTimeline } from "src/utils/supportsScrollTimeline";

const scrollTimelineSupported = supportsScrollTimeline();

interface UseFeaturedReelInViewOptions {
  priority?: boolean;
}

export const useFeaturedReelInView = (
  options: UseFeaturedReelInViewOptions = {},
) => {
  const { priority = false } = options;
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasMountedPlayer, setHasMountedPlayer] = useState(priority);

  const { inView: playInView, ref: playRef } = useInView({
    initialInView: priority,
    threshold: 0,
    triggerOnce: false,
    onChange: (visible) => {
      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  const { inView: preloadInView, ref: preloadRef } = useInView({
    initialInView: priority,
    rootMargin: VIDEO_MOUNT_ROOT_MARGIN,
    threshold: 0,
    triggerOnce: false,
  });

  useEffect(() => {
    if (priority || preloadInView) {
      setHasMountedPlayer(true);
    }
  }, [preloadInView, priority]);

  const ref = useCallback(
    (node: HTMLDivElement | null) => {
      playRef(node);
      preloadRef(node);
    },
    [preloadRef, playRef],
  );

  return {
    hasAnimated,
    hasMountedPlayer,
    playInView,
    ref,
  };
};
