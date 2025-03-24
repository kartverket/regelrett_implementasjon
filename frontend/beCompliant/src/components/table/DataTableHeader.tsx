import {
  Button,
  Icon,
  KvibMenu,
  KvibTable,
  TableColumnHeaderProps,
  Text,
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
    column.clearSorting();
    setColumnVisibility((prev) => ({
      ...prev,
      [name]: false,
    }));
  };
  const isSorted = column.getIsSorted() !== false;
  const isAscending = column.getIsSorted() === 'asc';
  const isSortedAscending = isSorted && isAscending;
  const isSortedDescending = isSorted && !isAscending;

  return (
    <KvibTable.ColumnHeader
      paddingY="2"
      paddingX="2"
      key={column.columnDef.id}
      {...rest}
    >
      <KvibMenu.Root>
        <KvibMenu.Trigger>
          <Button
            variant="tertiary"
            iconFill={isSorted}
            rightIcon={
              isSortedAscending
                ? 'arrow_upward'
                : isSortedDescending
                  ? 'arrow_downward'
                  : undefined
            }
            colorPalette="blue"
          >
            <Text fontWeight={isSorted ? 'bold' : 'normal'} fontSize="md">
              {header}
            </Text>
          </Button>
        </KvibMenu.Trigger>
        <KvibMenu.Positioner>
          <KvibMenu.Content fontWeight="normal">
            <KvibMenu.ItemGroup>
              <KvibMenu.Item
                aria-label="Sorter stigende"
                value="ascending"
                onClick={() => column.toggleSorting(false)}
                background={isSortedAscending ? '{colors.gray.50}' : undefined}
              >
                <Icon icon="arrow_upward" />
                <Text textStyle="md">{'Sorter stigende'}</Text>
              </KvibMenu.Item>
              <KvibMenu.Item
                aria-label="Sorter synkende"
                value="descending"
                onClick={() => column.toggleSorting(true)}
                background={isSortedDescending ? '{colors.gray.50}' : undefined}
              >
                <Icon icon="arrow_downward" />
                <Text fontSize="md">{'Sorter synkende'}</Text>
              </KvibMenu.Item>
              {isSorted && (
                <KvibMenu.Item
                  aria-label="Fjern sortering"
                  value="cancel"
                  onClick={() => column.clearSorting()}
                >
                  <Icon icon="close" />
                  <Text fontSize="md">{'Fjern sortering'}</Text>
                </KvibMenu.Item>
              )}
            </KvibMenu.ItemGroup>
            <KvibMenu.Separator />
            <KvibMenu.Item
              aria-label={'Skjul kolonne'}
              value="hide"
              onClick={() => hideColumn(header)}
            >
              <Icon icon="visibility_off" />
              <Text fontSize="md">{'Skjul kolonne'}</Text>
            </KvibMenu.Item>
          </KvibMenu.Content>
        </KvibMenu.Positioner>
      </KvibMenu.Root>
    </KvibTable.ColumnHeader>
  );
}
