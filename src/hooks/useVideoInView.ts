import { useCallback, useState } from "react";
import { useInView } from "react-intersection-observer";
import {
  VIDEO_IN_VIEW_ROOT_MARGIN,
  VIDEO_IN_VIEW_ROOT_MARGIN_PX,
} from "src/utils/constants";
import {
  isNearViewport,
  supportsScrollTimeline,
} from "src/utils/intersection.helpers";

const scrollTimelineSupported = supportsScrollTimeline();

interface UseVideoInViewOptions {
  triggerOnce: boolean;
}

export const useVideoInView = (options: UseVideoInViewOptions) => {
  const { triggerOnce } = options;
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isInitiallyInView, setIsInitiallyInView] = useState(false);

  const { inView, ref: inViewRef } = useInView({
    rootMargin: VIDEO_IN_VIEW_ROOT_MARGIN,
    threshold: 0,
    triggerOnce,
    onChange: (visible) => {
      if (visible) {
        setIsInitiallyInView(true);

        if (!scrollTimelineSupported) {
          setHasAnimated(true);
        }
      }
    },
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      inViewRef(node);

      if (node && isNearViewport(node, VIDEO_IN_VIEW_ROOT_MARGIN_PX)) {
        setIsInitiallyInView(true);

        if (!scrollTimelineSupported) {
          setHasAnimated(true);
        }
      }
    },
    [inViewRef],
  );

  const isNearView = inView || isInitiallyInView;

  return {
    hasAnimated,
    inView,
    isNearView,
    setRef,
  };
};
