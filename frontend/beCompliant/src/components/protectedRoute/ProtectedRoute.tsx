import { useAuthCheck } from '../../hooks/useAuthCheck';
import { Header } from '@kvib/react';
import { Link as ReactRouterLink, Outlet } from 'react-router-dom';
import useBackendUrl from '../../hooks/backendUrl';
import { useEffect } from 'react';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthCheck();
  const loginUrl = useBackendUrl('/login');

  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = loginUrl;
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header logoLinkProps={{ as: ReactRouterLink }} />
      <Outlet />
    </>
  );
};
