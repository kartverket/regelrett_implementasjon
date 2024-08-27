import { Flex, FlexProps } from '@kvib/react';

export function Page({ children, ...rest }: FlexProps) {
  return (
    <Flex
      width="100%"
      direction="column"
      gap={{ base: '6', md: '8' }}
      paddingY="10"
      {...rest}
    >
      {children}
    </Flex>
  );
}
