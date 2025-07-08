// Type declarations for performance APIs
interface PerformanceEventTiming extends PerformanceEntry {
  processingStart: number;
  processingEnd: number;
  target?: EventTarget;
}

interface LayoutShift extends PerformanceEntry {
  value: number;
  hadRecentInput: boolean;
  lastInputTime: number;
  sources?: LayoutShiftAttribution[];
}

interface LayoutShiftAttribution {
  node?: Node;
  currentRect?: DOMRectReadOnly;
  previousRect?: DOMRectReadOnly;
}

export interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  TTI?: number;
}

export const trackPerformanceMetrics = () => {
  if (typeof window === "undefined") return;

  // Track First Contentful Paint (FCP)
  if ("PerformanceObserver" in window) {
    const fcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(
        (entry) => entry.name === "first-contentful-paint",
      );
      if (fcpEntry) {
        const fcp = fcpEntry.startTime;
        console.log("FCP:", fcp);
        // Send to analytics
        window.dataLayer?.push({
          event: "performance_metric",
          metric_name: "FCP",
          metric_value: fcp,
        });
      }
    });
    fcpObserver.observe({ entryTypes: ["paint"] });
  }

  // Track Largest Contentful Paint (LCP)
  if ("PerformanceObserver" in window) {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      if (lastEntry) {
        const lcp = lastEntry.startTime;
        console.log("LCP:", lcp);
        window.dataLayer?.push({
          event: "performance_metric",
          metric_name: "LCP",
          metric_value: lcp,
        });
      }
    });
    lcpObserver.observe({ entryTypes: ["largest-contentful-paint"] });
  }

  // Track First Input Delay (FID)
  if ("PerformanceObserver" in window) {
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const fidEntry = entry as PerformanceEventTiming;
        const fid = fidEntry.processingStart - fidEntry.startTime;
        console.log("FID:", fid);
        window.dataLayer?.push({
          event: "performance_metric",
          metric_name: "FID",
          metric_value: fid,
        });
      });
    });
    fidObserver.observe({ entryTypes: ["first-input"] });
  }

  // Track Cumulative Layout Shift (CLS)
  let clsValue = 0;
  let clsEntries: PerformanceEntry[] = [];

  if ("PerformanceObserver" in window) {
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const clsEntry = entry as LayoutShift;
        if (!clsEntry.hadRecentInput) {
          clsValue += clsEntry.value;
          clsEntries.push(entry);
        }
      });
    });
    clsObserver.observe({ entryTypes: ["layout-shift"] });

    // Report CLS when page is hidden
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        console.log("CLS:", clsValue);
        window.dataLayer?.push({
          event: "performance_metric",
          metric_name: "CLS",
          metric_value: clsValue,
        });
      }
    });
  }

  // Track Time to First Byte (TTFB)
  if ("PerformanceObserver" in window) {
    const navigationObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === "navigation") {
          const navigationEntry = entry as PerformanceNavigationTiming;
          const ttfb =
            navigationEntry.responseStart - navigationEntry.requestStart;
          console.log("TTFB:", ttfb);
          window.dataLayer?.push({
            event: "performance_metric",
            metric_name: "TTFB",
            metric_value: ttfb,
          });
        }
      });
    });
    navigationObserver.observe({ entryTypes: ["navigation"] });
  }
};

export const trackResourceTiming = () => {
  if (typeof window === "undefined") return;

  // Track slow resources
  if ("PerformanceObserver" in window) {
    const resourceObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const resourceEntry = entry as PerformanceResourceTiming;
        const duration = resourceEntry.duration;

        // Track resources that take longer than 1 second
        if (duration > 1000) {
          console.warn("Slow resource:", resourceEntry.name, duration);
          window.dataLayer?.push({
            event: "slow_resource",
            resource_url: resourceEntry.name,
            duration: duration,
            resource_type: resourceEntry.initiatorType,
          });
        }
      });
    });
    resourceObserver.observe({ entryTypes: ["resource"] });
  }
};

export const trackLongTasks = () => {
  if (typeof window === "undefined") return;

  // Track long tasks that block the main thread
  if ("PerformanceObserver" in window) {
    const longTaskObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        const duration = entry.duration;
        if (duration > 50) {
          // Tasks longer than 50ms
          console.warn("Long task detected:", duration);
          window.dataLayer?.push({
            event: "long_task",
            duration: duration,
            start_time: entry.startTime,
          });
        }
      });
    });
    longTaskObserver.observe({ entryTypes: ["longtask"] });
  }
};
