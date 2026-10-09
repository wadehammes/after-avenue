import { type ComponentType, createElement, useEffect, useState } from "react";

export const createBrowserLazyDefault = <P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
) => {
  const BrowserLazyDefault = (props: P) => {
    const [Component, setComponent] = useState<ComponentType<P> | null>(null);

    useEffect(() => {
      importFn().then((module) => {
        setComponent(() => module.default);
      });
    }, []);

    if (!Component) {
      return null;
    }

    return createElement(Component, props);
  };

  return BrowserLazyDefault;
};
