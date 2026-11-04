import { type ComponentType, createElement, useEffect, useState } from "react";

type BrowserLazyDefaultProps<P extends object> = P & {
  modulePromise: Promise<{ default: ComponentType<P> }>;
};

export const BrowserLazyDefault = <P extends object>(
  props: BrowserLazyDefaultProps<P>,
) => {
  const { modulePromise, ...rest } = props;
  const [Component, setComponent] = useState<ComponentType<P> | null>(null);

  useEffect(() => {
    modulePromise.then((module) => {
      setComponent(() => module.default);
    });
  }, [modulePromise]);

  if (!Component) {
    return null;
  }

  return createElement(Component, rest as P);
};
