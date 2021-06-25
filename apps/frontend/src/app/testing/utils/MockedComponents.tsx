import { useEffect } from 'react';
import { defaultUser } from './common';
import { useAuthContext } from '../../hooks';

export const AuthMock = ({ children }) => {
  const auth = useAuthContext();

  useEffect(() => {
    const loginUser = async () => {
      await auth.login(defaultUser.email, defaultUser.password);
    };

    loginUser();
  }, []);

  return <>{children}</>;
};
