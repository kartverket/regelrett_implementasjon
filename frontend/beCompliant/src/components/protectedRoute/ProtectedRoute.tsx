import { Box, Button, Header, Text } from '@kvib/react';
import { Link as ReactRouterLink, Outlet } from 'react-router';
import { MsalAuthenticationTemplate, MsalProvider } from '@azure/msal-react';
import { authenticationRequest, msalInstance } from '../../api/msal';
import { InteractionType } from '@azure/msal-browser';

export default function ProtectedRoute() {
  // Kvib har en bug som gjør at headeren rendres to ganger,
  // både som standard Header, og som menyen som er ment å
  // ligge under en hamburgermeny. Denne hacken fjerner
  // kopien fra DOMen, men er ikke spesielt robust, og burde
  // slettes dersom kvib løser bugen.
  function removeMenuBug(div: HTMLDivElement) {
    if (!div) return;
    const header = div.firstChild;
    if (header?.childNodes && header.childNodes.length > 1) {
      header.lastChild?.remove();
    }
  }

  return (
    <MsalProvider instance={msalInstance}>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authenticationRequest}
      >
        <Box backgroundColor="gray.50" minHeight="100vh">
          <div ref={removeMenuBug}>
            <Header logoLinkProps={{ as: ReactRouterLink, marginLeft: '2' }}>
              <Button
                variant="tertiary"
                onClick={() => msalInstance.logoutRedirect()}
                leftIcon="logout"
              >
                <Text>Logg ut</Text>
              </Button>
            </Header>
          </div>
          <Outlet />
        </Box>
      </MsalAuthenticationTemplate>
    </MsalProvider>
  );
}
