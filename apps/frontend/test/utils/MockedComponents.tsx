import { useEffect } from 'react';
import { defaultUser } from './common';
import { useAuth } from '../../src/app/hooks';

export const AuthMock = ({ children }) => {
  const auth = useAuth();

  useEffect(() => {
    const loginUser = async () => {
      await auth.login(defaultUser.email, defaultUser.password);
    };

    loginUser();
  }, []);

  return <>{children}</>;
};
