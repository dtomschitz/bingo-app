import { createContext, ReactNode, useContext, useState } from 'react';

interface AppBarProviderProps {
  children: ReactNode;
}

interface AppBarContext {
  loading: boolean;
  showLoadingBar: (value: boolean) => void;
}

export const appBarContext = createContext<AppBarContext>(null);

export const AppBarProvider = ({ children }: AppBarProviderProps) => {
  const [loading, showLoadingBar] = useState(false);

  return (
    <appBarContext.Provider
      value={{
        loading,
        showLoadingBar,
      }}
    >
      {children}
    </appBarContext.Provider>
  );
};

export const useAppBar = () => useContext(appBarContext);
