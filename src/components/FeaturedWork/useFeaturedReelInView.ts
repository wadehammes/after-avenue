import { useCallback, useState } from "react";
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
  const [playInView, setPlayInView] = useState(priority);

  const { ref } = useInView({
    initialInView: priority,
    threshold: 0,
    triggerOnce: false,
    onChange: (visible) => {
      setPlayInView(visible);

      if (visible && !scrollTimelineSupported) {
        setHasAnimated(true);
      }
    },
  });

  const onPlayerReady = useCallback(() => {
    if (priority) {
      setPlayInView(true);
    }
  }, [priority]);

  return { hasAnimated, onPlayerReady, playInView, ref };
};
