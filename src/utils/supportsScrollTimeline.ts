/** Scroll-driven animations (`animation-timeline: view()`). */
export const supportsScrollTimeline = (): boolean => {
  return (
    typeof CSS !== "undefined" && CSS.supports("animation-timeline: view()")
  );
};
