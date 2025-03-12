import { useStoredRedirect } from '../hooks/useStoredRedirect';
import { Button, Flex } from '@kvib/react';

export default function RedirectBackButton() {
  const storedRedirect = useStoredRedirect();

  if (!storedRedirect) return null;

  return (
    <Flex
      flexDirection="column"
      alignItems="start"
      justifyContent="start"
      p="2"
      position="sticky"
      top="0"
      zIndex="1000"
      backgroundColor="gray.50"
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
