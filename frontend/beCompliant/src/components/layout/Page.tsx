import { Flex, FlexProps } from '@kvib/react';

export function Page({ children, ...rest }: FlexProps) {
  return (
    <Flex
      direction="column"
      gap={{ base: '4', md: '8' }}
      justifyContent="center"
      alignItems="center"
      mx={{ base: '2', md: '8' }}
      my={'4'}
      {...rest}
    >
      {children}
    </Flex>
  );
}
