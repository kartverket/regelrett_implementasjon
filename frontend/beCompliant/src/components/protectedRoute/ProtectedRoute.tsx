import { Box, Button, Header, Text } from '@kvib/react';
import { Outlet, Link as ReactRouterLink } from 'react-router-dom';
import { useLogOut } from '../../hooks/useLogOut';

export const ProtectedRoute = () => {
  const { mutate: logOut } = useLogOut();

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
