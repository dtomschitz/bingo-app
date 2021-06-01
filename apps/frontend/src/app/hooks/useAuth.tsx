import { createContext, ReactNode, useContext, useState } from 'react';
import { gql, ApolloClient, NormalizedCacheObject } from '@apollo/client';
import { User, AuthResult, RegisterProps } from '@bingo/models';
import { useDialog } from './useDialog';
import { DialogState } from '../components/common';

const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    loginUser(email: $email, password: $password) {
      user {
        name
        email
      }
      accessToken
      refreshToken
    }
  }
`;

const USER_LOGOUT = gql`
  mutation UserLogout($email: String!) {
    logoutUser(email: $email) {
      success
    }
  }
`;

const REGISTER_USER = gql`
  mutation UserRegister($name: String!, $email: String!, $password: String!) {
    registerUser(props: { name: $name, email: $email, password: $password }) {
      user {
        name
        email
      }
      accessToken
      refreshToken
    }
  }
`;

const VERIFY_USER = gql`
  mutation VerifyUser($refreshToken: String!) {
    verifyUser(refreshToken: $refreshToken) {
      name
      email
    }
  }
`;

interface AuthProviderProps {
  children: ReactNode;
  client: ApolloClient<NormalizedCacheObject>;
}

export interface AuthContext {
  user: User;
  dialog: DialogState;
  isPending: boolean;
  isLoggedIn: boolean;
  isVerifying: boolean;
  accessToken: string;
  refreshToken: string;
  login: (email: string, password: string) => Promise<boolean>;
  register: (props: RegisterProps) => Promise<boolean>;
  logout: () => Promise<boolean>;
  verify: () => Promise<boolean>;
}

const context = createContext<AuthContext>(null);

export const AuthProvider = ({ children, client }: AuthProviderProps) => {
  const [user, setUser] = useState<User>(undefined);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);

  const dialog = useDialog();

  const isLoggedIn = !!user;
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const setAuthContext = ({ user, accessToken, refreshToken }: AuthResult) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const resetAuthContext = () => {
    setUser(undefined);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
  };

  const setRefreshToken = (token: string) => {
    localStorage.setItem('refreshToken', token);
  };

  const login = (email: string, password: string) => {
    return client
      .mutate<{ loginUser: AuthResult }>({
        mutation: USER_LOGIN,
        variables: {
          email,
          password,
        },
        fetchPolicy: 'no-cache',
      })
      .then(result => {
        setAuthContext(result.data.loginUser);
        return true;
      });
  };

  const logout = () => {
    return client
      .mutate<{ logoutUser: boolean }>({
        mutation: USER_LOGOUT,
        variables: {
          email: user.email,
        },
        fetchPolicy: 'no-cache',
      })
      .then(() => {
        resetAuthContext();
        return true;
      })
      .catch(() => {
        resetAuthContext();
        return false;
      });
  };

  const register = ({ name, email, password }: RegisterProps) => {
    return client
      .mutate<{ registerUser: AuthResult }>({
        mutation: REGISTER_USER,
        variables: {
          name,
          email,
          password,
        },
        fetchPolicy: 'no-cache',
      })
      .then(result => {
        setAuthContext(result.data.registerUser);
        return true;
      })
      .catch(() => false);
  };

  const verify = () => {
    if (!refreshToken) {
      setIsVerifying(false);
      return;
    }

    setIsPending(true);

    return client
      .mutate<{ verifyUser: User }>({
        mutation: VERIFY_USER,
        variables: {
          refreshToken,
        },
        fetchPolicy: 'no-cache',
      })
      .then(result => {
        setUser(result.data.verifyUser);
        return true;
      })
      .catch(e => {
        resetAuthContext();
        throw e;
      })
      .finally(() => {
        setIsPending(false);
        setIsVerifying(false);
      });
  };

  return (
    <context.Provider
      value={{
        user,
        dialog,
        isPending,
        isLoggedIn,
        isVerifying,
        accessToken,
        refreshToken,
        login,
        logout,
        register,
        verify,
      }}
    >
      {children}
    </context.Provider>
  );
};

export const useAuthContext = () => useContext(context);
