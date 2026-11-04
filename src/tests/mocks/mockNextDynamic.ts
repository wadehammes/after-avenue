import { type ComponentType, createElement, useEffect, useState } from "react";

type DynamicLoader<P extends object> = () => Promise<{
  default: ComponentType<P>;
}>;

type DynamicOptions<P extends object> = {
  loading?: ComponentType<P>;
  ssr?: boolean;
};

type DynamicHostProps = {
  loader: () => Promise<{ default: ComponentType<object> }>;
  componentProps: object;
};

const DynamicHost = (props: DynamicHostProps) => {
  const { loader, componentProps } = props;
  const [Component, setComponent] = useState<ComponentType<object> | null>(
    null,
  );

  useEffect(() => {
    loader().then((mod) => {
      setComponent(() => mod.default);
    });
  }, [loader]);

  if (!Component) {
    return null;
  }

  return createElement(Component, componentProps);
};

DynamicHost.displayName = "DynamicMock";

const mockNextDynamic = <P extends object>(
  loader: DynamicLoader<P>,
  _options?: DynamicOptions<P>,
): ComponentType<P> => {
  const loaderForHost = loader as DynamicHostProps["loader"];

  return (props: P) =>
    createElement(DynamicHost, {
      loader: loaderForHost,
      componentProps: props,
    });
};

export default mockNextDynamic;
