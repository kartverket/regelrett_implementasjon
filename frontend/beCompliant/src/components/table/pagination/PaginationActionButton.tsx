import { Button, ButtonProps, Flex, Text } from '@kvib/react';

interface Props extends ButtonProps {
  isDisplayed?: boolean;
  isCurrent?: boolean;
  onClick: () => void;
  ariaLabel: string;
}

export function PaginationActionButton({
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
      colorScheme="blue"
      background={isCurrent ? 'blue.100' : undefined}
      variant="ghost"
      {...rest}
    >
      {isChildrenString ? <Text fontSize="md">{children}</Text> : children}
    </Button>
  );
}
