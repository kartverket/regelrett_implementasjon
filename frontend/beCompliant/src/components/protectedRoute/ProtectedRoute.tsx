import { useAuthCheck } from '../../hooks/useAuthCheck';
import { Header } from '@kvib/react';
import { Link as ReactRouterLink, Outlet } from 'react-router-dom';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthCheck();
  if (isAuthenticated) {
    return (
      <>
        <Header logoLinkProps={{ as: ReactRouterLink }} />
        <Outlet />
      </>
    );
  }
  return <></>;
};
