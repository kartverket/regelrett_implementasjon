import { Flex, FlexProps } from '@kvib/react';

export function Page({ children, ...rest }: FlexProps) {
  return (
    <Flex
      direction="column"
      gap={{ base: '4', md: '8' }}
      mx={{ base: '2', md: '4' }}
      my={'4'}
      alignItems="center"
      {...rest}
    >
      {children}
    </Flex>
  );
}
