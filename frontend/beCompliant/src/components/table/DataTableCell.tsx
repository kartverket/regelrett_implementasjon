import { TableCellProps, Td } from '@kvib/react';
import { Cell } from '@tanstack/react-table';

interface Props<TData, TValue> extends TableCellProps {
  cell: Cell<TData, TValue>;
}

export function DataTableCell<TData, TValue>({
  cell,
  children,
  ...rest
}: Props<TData, TValue>) {
  return (
    <Td key={cell.id} paddingY="4" {...rest}>
      {children}
    </Td>
  );
}
