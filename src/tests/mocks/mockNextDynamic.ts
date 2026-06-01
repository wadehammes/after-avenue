import { type ComponentType, createElement, useEffect, useState } from "react";

type DynamicLoader<P extends object> = () => Promise<{
  default: ComponentType<P>;
}>;

type DynamicOptions<P extends object> = {
  loading?: ComponentType<P>;
  ssr?: boolean;
};

/**
 * Jest stand-in for `next/dynamic`. Runs the import loader and renders the
 * resolved default export—no lazy loading or SSR split in unit tests.
 */
const mockNextDynamic = <P extends object>(
  loader: DynamicLoader<P>,
  _options?: DynamicOptions<P>,
): ComponentType<P> => {
  const DynamicComponent = (props: P) => {
    const [Component, setComponent] = useState<ComponentType<P> | null>(null);

    useEffect(() => {
      loader().then((mod) => {
        setComponent(() => mod.default);
      });
    }, []);

    if (!Component) {
      return null;
    }

    return createElement(Component, props);
  };

  DynamicComponent.displayName = "DynamicMock";

  return DynamicComponent;
};

export default mockNextDynamic;
