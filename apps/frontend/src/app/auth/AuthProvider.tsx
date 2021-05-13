import { AuthContext } from '@bingo/models';
import { createContext } from 'react';
import { useProvideAuth } from './useAuth';

export const authContext = createContext<AuthContext>({
  user: undefined,
  accessToken: undefined,
  refreshToken: undefined,
  isPending: false,
  isLoggedIn: false,
});

export const AuthProvider = ({ children }) => {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
};
