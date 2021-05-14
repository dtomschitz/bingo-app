import { ReactNode } from 'react';
import { Redirect, Route, RouteProps, useLocation } from 'react-router';
import { useAuth } from '../auth';

interface ProtectedRouteProps {
  children: ReactNode;
  redirectPath?: string;
  routeProps?: RouteProps;
}

export const ProtectedRoute = ({
  redirectPath,
  children,
  ...routeProps
}: ProtectedRouteProps) => {
  const auth = useAuth();
  const location = useLocation();

  return (
    <Route {...routeProps}>
      {auth.isLoggedIn ? (
        children
      ) : (
        <Redirect
          to={{
            pathname: redirectPath ?? '/',
            state: { from: location },
          }}
        />
      )}
    </Route>
  );
};
