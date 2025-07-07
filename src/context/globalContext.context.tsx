import { createContext, type ReactNode, useContext } from "react";
import type { GlobalVariables } from "src/contentful/getGlobalVariables";

const GlobalVariablesContext = createContext<GlobalVariables | null>(null);

interface GlobalVariablesProviderProps {
  children: ReactNode;
  value: GlobalVariables | null;
}

export const GlobalVariablesProvider = ({
  children,
  value,
}: GlobalVariablesProviderProps) => {
  return (
    <GlobalVariablesContext.Provider value={value}>
      {children}
    </GlobalVariablesContext.Provider>
  );
};

export const useGlobalVariables = () => {
  const context = useContext(GlobalVariablesContext);

  if (context === null) {
    throw new Error(
      "useGlobalVariables must be used within a GlobalVariablesProvider",
    );
  }

  return context;
};
