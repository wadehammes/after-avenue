import { useEffect, useRef } from "react";

export const usePassiveTouchEvents = <T extends HTMLElement>() => {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Add passive touch event listeners
    const touchEvents = ["touchstart", "touchmove", "touchend", "touchcancel"];
    const listeners: Array<{ type: string; listener: EventListener }> = [];

    touchEvents.forEach((type) => {
      const listener = (e: Event) => {
        // Prevent default only if necessary
        // For most cases, we want to allow default behavior
        e.stopPropagation();
      };

      // Always use passive: true for touch events
      element.addEventListener(type, listener, { passive: true });
      listeners.push({ type, listener });
    });

    return () => {
      listeners.forEach(({ type, listener }) => {
        element.removeEventListener(type, listener);
      });
    };
  }, []);

  return elementRef;
};
