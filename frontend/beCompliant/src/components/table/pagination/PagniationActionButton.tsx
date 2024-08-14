import { Button, ButtonProps, Text } from '@kvib/react';
import React from 'react';

interface Props extends ButtonProps {
  isDisabled?: boolean;
  isDisplayed?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function PagniationActionButton({
  isDisabled = false,
  isDisplayed = true,
  children,
  ...rest
}: Props) {
  const isChildrenString = typeof children === 'string';

  return (
    <Button
      boxSize="12"
      isDisabled={isDisabled}
      display={isDisplayed ? 'flex' : 'none'}
      {...rest}
    >
      {isChildrenString ? <Text fontSize="md">{children}</Text> : children}
    </Button>
  );
}
