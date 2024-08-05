import { Flex, FlexProps } from '@kvib/react';

export function Page({ children, ...rest }: FlexProps) {
  return (
    <Flex
      w={'100%'}
      direction="column"
      gap={{ base: '6', md: '8' }}
      py={'10'}
      bg={'gray.50'}
      {...rest}
    >
      {children}
    </Flex>
  );
}
