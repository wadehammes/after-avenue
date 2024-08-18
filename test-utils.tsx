/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable import/export -- not needed for this file */
import { RenderOptions, render } from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import { NextRouter } from "next/router";
import { FC, ReactElement } from "react";
import { PropsWithChildrenOnly } from "src/@types/react";

const mockRouter: NextRouter = {
  basePath: "/",
  pathname: "/",
  route: "/",
  query: {},
  asPath: "/",
  locale: "",
  push: jest.fn(() => Promise.resolve(true)),
  replace: jest.fn(() => Promise.resolve(true)),
  reload: jest.fn(() => Promise.resolve(true)),
  prefetch: jest.fn(() => Promise.resolve()),
  back: jest.fn(() => Promise.resolve(true)),
  beforePopState: jest.fn(() => Promise.resolve(true)),
  isFallback: false,
  isLocaleDomain: false,
  isPreview: false,
  isReady: false,
  events: {
    on: jest.fn(),
    off: jest.fn(),
    emit: jest.fn(),
  },
  forward: jest.fn(() => Promise.resolve(true)),
};

const Providers: FC<PropsWithChildrenOnly> = ({ children }) => (
  <RouterContext.Provider value={mockRouter}>{children}</RouterContext.Provider>
);

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: Providers, ...options });

export * from "@testing-library/react";

export { customRender as render };
