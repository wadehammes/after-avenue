"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { GlobalVariables } from "src/contentful/getGlobalVariables";
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
        {children}
      </GlobalVariablesProvider>
    </QueryClientProvider>
  );
}
