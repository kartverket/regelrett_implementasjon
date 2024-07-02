import { Button, Icon, TableColumnHeaderProps, Th } from '@kvib/react';
import { Column } from '@tanstack/react-table';

interface Props<TData, TValue> extends TableColumnHeaderProps {
  column: Column<TData, TValue>;
  header: string;
}

export function DataTableHeader<TData, TValue>({
  column,
  header,
  ...rest
}: Props<TData, TValue>) {
  return (
    <Th key={column.columnDef.id} {...rest}>
      <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
        {header}
        {column.getIsSorted() && (
          <Icon
            icon={
              column.getIsSorted() === 'desc'
                ? 'arrow_drop_down'
                : 'arrow_drop_up'
            }
          />
        )}
      </Button>
    </Th>
  );
}
