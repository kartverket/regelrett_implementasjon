import { Button, ButtonProps, Flex, Text } from '@kvib/react';
import React from 'react';

interface Props extends ButtonProps {
  isDisabled?: boolean;
  isDisplayed?: boolean;
  isCurrent?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function PagniationActionButton({
  isDisabled = false,
  isDisplayed = true,
  isCurrent = false,
  children,
  ariaLabel,
  ...rest
}: Props) {
  const isChildrenString = typeof children === 'string';

  if (!isDisplayed) {
    return <Flex boxSize="10" />;
  }

  return (
    <Button
      aria-label={ariaLabel}
      boxSize="10"
      isDisabled={isDisabled}
      colorScheme="blue"
      bg={isCurrent ? 'blue.100' : undefined}
      variant="ghost"
      {...rest}
    >
      {isChildrenString ? <Text fontSize="md">{children}</Text> : children}
    </Button>
  );
}
