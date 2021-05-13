import { ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { AuthContext } from '@bingo/models';
import { createContext, ReactNode } from 'react';
import { useProvideAuth } from './useAuth';

interface AuthProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

export const authContext = createContext<AuthContext>({
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  isPending: false,
  isLoggedIn: false,
});

export const AuthProvider = ({ children, client }: AuthProviderProps) => {
  const auth = useProvideAuth(client);
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
