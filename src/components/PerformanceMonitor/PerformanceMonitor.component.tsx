"use client";

import { useEffect } from "react";
import {
  trackLongTasks,
  trackPerformanceMetrics,
  trackResourceTiming,
} from "src/lib/performance";

export const PerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      trackPerformanceMetrics();
      trackResourceTiming();
      trackLongTasks();
    }
  }, []);

  return null;
};
