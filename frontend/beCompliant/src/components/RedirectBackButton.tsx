import { useStoredRedirect } from '../hooks/useStoredRedirect';
import { Button, Flex } from '@kvib/react';

export function RedirectBackButton() {
  const storedRedirect = useStoredRedirect();

  if (!storedRedirect) return null;

  return (
    <Flex
      flexDirection="column"
      alignItems="start"
      justifyContent="start"
      p="2"
    >
      <Button
        p="0"
        variant="tertiary"
        colorScheme="blue"
        leftIcon="arrow_back"
        onClick={() => {
          window.location.href = storedRedirect.url;
        }}
      >
        Tilbake til {storedRedirect.title}
      </Button>
    </Flex>
  );
}
