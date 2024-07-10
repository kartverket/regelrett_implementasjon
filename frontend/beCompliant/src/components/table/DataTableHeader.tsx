import {
  Button,
  Flex,
  Icon,
  IconButton,
  TableColumnHeaderProps,
  Th,
} from '@kvib/react';
import { Column } from '@tanstack/react-table';

interface Props<TData, TValue> extends TableColumnHeaderProps {
  column: Column<TData, TValue>;
  header: string;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
}

export function DataTableHeader<TData, TValue>({
  column,
  header,
  setColumnVisibility,
  ...rest
}: Props<TData, TValue>) {
  const hideColumn = (name: string) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [name]: false,
    }));
  };

  return (
    <Th key={column.columnDef.id} {...rest}>
      <Flex alignItems="center">
        <IconButton
          variant="tertiary"
          size="xs"
          onClick={() => hideColumn(header)}
          aria-label={'Remove column from table'}
          icon={'close'}
        />
        <Button variant="ghost" onClick={column.getToggleSortingHandler()}>
          {header}
          <Icon
            aria-label={
              column.getIsSorted() != false
                ? column.getIsSorted() === 'desc'
                  ? 'Sortert synkende'
                  : 'Sortert stigende'
                : 'Ikke sortert'
            }
            icon={
              column.getIsSorted() != false
                ? column.getIsSorted() === 'desc'
                  ? 'keyboard_arrow_down'
                  : 'keyboard_arrow_up'
                : 'unfold_more'
            }
          />
        </Button>
      </Flex>
    </Th>
  );
}
