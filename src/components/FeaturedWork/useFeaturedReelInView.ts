import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
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

  const { inView, ref } = useInView({
    threshold: priority ? 0 : 0.35,
    triggerOnce: false,
    onChange: (visible) => {
      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  useEffect(() => {
    if (inView) {
      setHasMountedPlayer(true);
    }
  }, [inView]);

  return {
    hasAnimated,
    hasMountedPlayer,
    inView,
    ref,
  };
};
