import { useState } from "react";
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
  const [eagerPlay, setEagerPlay] = useState(priority);

  const { inView, ref } = useInView({
    initialInView: priority,
    rootMargin: priority ? "0px" : "0px 0px -12% 0px",
    threshold: priority ? 0 : 0.2,
    triggerOnce: false,
    onChange: (visible) => {
      if (visible) {
        setEagerPlay((current) => (current ? false : current));
      }

      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  const shouldPlay = inView || (priority && eagerPlay);

  return {
    hasAnimated,
    inView,
    ref,
    shouldPlay,
  };
};
