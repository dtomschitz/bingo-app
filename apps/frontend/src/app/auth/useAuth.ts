import { useContext, useState } from 'react';
import { useApolloClient, gql } from '@apollo/client';
import { User, AuthResult, LoginProps, RegisterProps } from '@bingo/models';
import { authContext } from './AuthProvider';

const USER_LOGIN = gql`
  mutation UserLogin($email: String!, $password: String!) {
    loginUser(props: { email: $email, password: $password }) {
      user {
        name
        email
      }
      accessToken
      refreshToken
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
    verifyUser(props: { refreshToken: $refreshToken }) {
      name
      email
    }
  }
`;

export const useAuth = () => {
  return useContext(authContext);
};

export const useProvideAuth = () => {
  const client = useApolloClient();
  const [user, setUser] = useState<User>(undefined);
  const [isPending, setIsPending] = useState<boolean>(false);

  const isLoggedIn = !!user;
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  const setAuthContext = ({ user, accessToken, refreshToken }: AuthResult) => {
    setUser(user);
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
  };

  const setAccessToken = (token: string) => {
    localStorage.setItem('accessToken', token);
  };

  const setRefreshToken = (token: string) => {
    localStorage.setItem('refreshToken', token);
  };

  const login = ({ email, password }: LoginProps) => {
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
      })
      .catch(() => false);
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

        setTimeout(() => {
          setIsPending(false);
        }, 1000);

        return true;
      })
      .catch(() => {
        setAuthContext(undefined);
        setIsPending(false);

        return false;
      });
  };

  return {
    user,
    login,
    register,
    verify,
    isPending,
    isLoggedIn,
    accessToken,
    refreshToken,
  };
};
