import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  type RenderHookOptions,
  type RenderOptions,
  render,
  renderHook as rtlRenderHook,
} from "@testing-library/react";
import { RouterContext } from "next/dist/shared/lib/router-context.shared-runtime";
import type { ReactElement } from "react";
import { useState } from "react";
import type { PropsWithChildrenOnly } from "src/@types/react";
import { mockedUseRouterReturnValue } from "src/tests/mocks/mockNextRouter";

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: { refetchOnWindowFocus: false, retry: false },
      mutations: { retry: false },
    },
  });

const Providers = ({ children }: PropsWithChildrenOnly) => {
  const [queryClient] = useState(() => createTestQueryClient());

  return (
    <RouterContext.Provider value={mockedUseRouterReturnValue}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </RouterContext.Provider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "queries">,
) => render(ui, { wrapper: Providers, ...options });

const customRenderHook = <Result, Props>(
  hook: (initialProps: Props) => Result,
  options?: Omit<RenderHookOptions<Props>, "wrapper">,
) => rtlRenderHook(hook, { wrapper: Providers, ...options });

export * from "@testing-library/react";
export { default as userEvent } from "@testing-library/user-event";

export { customRender as render, customRenderHook as renderHook };
