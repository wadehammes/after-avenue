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

  const { inView: playInView, ref } = useInView({
    initialInView: priority,
    threshold: 0,
    triggerOnce: false,
    onChange: (visible) => {
      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  useEffect(() => {
    if (priority || playInView) {
      setHasMountedPlayer(true);
    }
  }, [playInView, priority]);

  return {
    hasAnimated,
    hasMountedPlayer,
    playInView,
    ref,
  };
};
