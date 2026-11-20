import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { supportsScrollTimeline } from "src/utils/supportsScrollTimeline";

const scrollTimelineSupported = supportsScrollTimeline();

interface UseFeaturedReelInViewOptions {
  prefetchPlayer?: boolean;
  priority?: boolean;
}

export const useFeaturedReelInView = (
  options: UseFeaturedReelInViewOptions = {},
) => {
  const { prefetchPlayer = false, priority = false } = options;
  const [hasAnimated, setHasAnimated] = useState(false);
  const [hasMountedPlayer, setHasMountedPlayer] = useState(
    priority || prefetchPlayer,
  );

  const { inView, ref } = useInView({
    delay: priority ? 0 : 100,
    initialInView: priority,
    rootMargin: priority ? "0px" : "0px 0px 20% 0px",
    threshold: priority ? 0 : 0.35,
    triggerOnce: false,
    onChange: (visible) => {
      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  useEffect(() => {
    if (prefetchPlayer) {
      setHasMountedPlayer(true);
    }
  }, [prefetchPlayer]);

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
