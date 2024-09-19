import { useAuthCheck } from '../../hooks/useAuthCheck';
import { Box, Button, Header, Text } from '@kvib/react';
import { Link as ReactRouterLink, Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import { API_URL_LOGIN } from '../../api/apiConfig';
import { useLogOut } from '../../hooks/useLogOut';

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthCheck();
  const { mutate: logOut } = useLogOut();

  useEffect(() => {
    if (isAuthenticated === false) {
      window.location.href = API_URL_LOGIN;
    }
  }, [isAuthenticated]);

  if (isAuthenticated === null || !isAuthenticated) {
    return null;
  }

  return (
    <Box backgroundColor="gray.50" minHeight="100vh">
      <Header
        logoLinkProps={{ as: ReactRouterLink, marginLeft: '2' }}
        children={
          <Button variant="tertiary" onClick={() => logOut()} leftIcon="logout">
            <Text>Logg ut</Text>
          </Button>
        }
      />
      <Outlet />
    </Box>
  );
};
