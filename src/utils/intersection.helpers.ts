import { VIDEO_IN_VIEW_ROOT_MARGIN_PX } from "src/utils/constants";

export const isNearViewport = (
  element: HTMLElement,
  rootMarginPx = VIDEO_IN_VIEW_ROOT_MARGIN_PX,
): boolean => {
  const rect = element.getBoundingClientRect();
  const viewportHeight =
    window.innerHeight || document.documentElement.clientHeight;

  return (
    rect.top < viewportHeight + rootMarginPx && rect.bottom > -rootMarginPx
  );
};

/** Scroll-driven animations (`animation-timeline: view()`). */
export const supportsScrollTimeline = (): boolean => {
  return (
    typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")
  );
};
