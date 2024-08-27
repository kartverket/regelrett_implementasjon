import {
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  TableColumnHeaderProps,
  Text,
  Th,
  useTheme,
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
  const theme = useTheme();
  const hideColumn = (name: string) => {
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
    <Th paddingY="2" paddingX="2" key={column.columnDef.id} {...rest}>
      <Menu gutter={4} colorScheme="blue">
        <MenuButton
          as={Button}
          variant="tertiary"
          iconFill={isSorted}
          rightIcon={
            isSortedAscending
              ? 'arrow_upward'
              : isSortedDescending
                ? 'arrow_downward'
                : undefined
          }
          colorScheme="blue"
        >
          <Text as={isSorted ? 'b' : 'p'} fontSize="md">
            {header}
          </Text>
        </MenuButton>
        <MenuList>
          <MenuItem
            aria-label="Sorter stigende"
            onClick={() => column.toggleSorting(false)}
            icon={<Icon icon="arrow_upward" />}
            background={isSortedAscending ? theme.colors.gray[50] : undefined}
          >
            <Text fontSize="md">{'Sorter stigende'}</Text>
          </MenuItem>
          <MenuItem
            aria-label="Sorter synkende"
            onClick={() => column.toggleSorting(true)}
            icon={<Icon icon="arrow_downward" />}
            background={isSortedDescending ? theme.colors.gray[50] : undefined}
          >
            <Text fontSize="md">{'Sorter synkende'}</Text>
          </MenuItem>
          {isSorted && (
            <MenuItem
              aria-label="Fjern sortering"
              onClick={() => column.clearSorting()}
              icon={<Icon icon="close" />}
            >
              <Text fontSize="md">{'Fjern sortering'}</Text>
            </MenuItem>
          )}
          <MenuDivider />
          <MenuItem
            aria-label={'Skjul kolonne'}
            onClick={() => hideColumn(header)}
            icon={<Icon icon="visibility_off" />}
          >
            <Text fontSize="md">{'Skjul kolonne'}</Text>
          </MenuItem>
        </MenuList>
      </Menu>
    </Th>
  );
}
