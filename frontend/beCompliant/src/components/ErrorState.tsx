import { Center, Heading, Icon } from '@kvib/react';

export const ErrorState = ({ message }: { message: string }) => (
  <Center height="70svh" flexDirection="column" gap="4">
    <Icon icon="error" size={64} weight={600} />
    <Heading size={'md'}>{message}</Heading>
  </Center>
);
