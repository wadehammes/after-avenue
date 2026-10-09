"use client";

import { useEffect } from "react";

export const WorkPagePrefetch = () => {
  useEffect(() => {
    void import("react-player");
  }, []);

  return null;
};
