import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuthStatus } from '../lib/auth-utils';

export function ProtectedRoute({
  children,
  ...rest
}: {
  children: React.ReactNode;
  [key: string]: any;
}) {
  const isAuthenticated = useAuthStatus();

  if (isAuthenticated === null) {
    return <p>Loading...</p>;
  }
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: location },
            }}
          />
        )
      }
    />
  );
}
