import { Button, ButtonProps, Text } from '@kvib/react';
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

  return (
    <Button
      aria-label={ariaLabel}
      boxSize="12"
      isDisabled={isDisabled}
      display={isDisplayed ? 'flex' : 'none'}
      colorScheme="blue"
      bg={isCurrent ? 'blue.100' : undefined}
      variant="secondary"
      {...rest}
    >
      {isChildrenString ? <Text fontSize="md">{children}</Text> : children}
    </Button>
  );
}
