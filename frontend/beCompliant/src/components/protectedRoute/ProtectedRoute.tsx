import { Box, Button, Header, Text } from '@kvib/react';
import { Link as ReactRouterLink, Outlet } from 'react-router';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { authenticationRequest, msalInstance } from '../../api/msal';
import { InteractionType } from '@azure/msal-browser';

export default function ProtectedRoute() {
  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authenticationRequest}
      >
        <Box backgroundColor="gray.50" minHeight="100vh">
          <Header
            logoLinkProps={{ as: ReactRouterLink, marginLeft: '2' }}
            children={
              <Button
                variant="tertiary"
                onClick={() => msalInstance.logoutRedirect()}
                leftIcon="logout"
              >
                <Text>Logg ut</Text>
              </Button>
            }
          />
          <Outlet />
        </Box>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}
