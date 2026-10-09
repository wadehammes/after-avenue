"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { type ReactNode, useState } from "react";
import { ToastHost } from "src/components/Toast/ToastHost.component";
import type { GlobalVariables } from "src/contentful/getGlobalVariables";
import { GlobalVariablesProvider } from "src/context/globalContext.context";

interface ProvidersProps {
  children: ReactNode;
  globalVariables: GlobalVariables | null;
}

export default function Providers(props: ProvidersProps) {
  const { children, globalVariables } = props;

  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <GlobalVariablesProvider value={globalVariables}>
        <ToastHost>{children}</ToastHost>
      </GlobalVariablesProvider>
    </QueryClientProvider>
  );
}
