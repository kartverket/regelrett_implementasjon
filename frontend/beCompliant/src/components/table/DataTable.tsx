import { flexRender, Table as TanstackTable } from '@tanstack/react-table';
import {
  Flex,
  Heading,
  Table,
  TableContainer,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Thead,
  Tr,
} from '@kvib/react';
import { DataTableSearch } from './DataTableSearch';

interface Props<TData> {
  table: TanstackTable<TData>;
  showSearch?: boolean;
  unHideColumn: (name: string) => void;
  hasHiddenColumns?: boolean;
}

export function DataTable<TData>({
  table,
  showSearch = true,
  unHideColumn,
  hasHiddenColumns = false,
}: Props<TData>) {
  const columnVisibility = table.getState().columnVisibility;
  return (
    <Flex flexDirection="column" w="100%">
      <Flex
        justifyContent={hasHiddenColumns ? 'space-between' : 'flex-end'}
        w="100%"
        px="8"
        my={'4'}
        alignItems="top"
        height="12"
      >
        {hasHiddenColumns && (
          <Flex direction="column" gap="2">
            <Heading size="xs">Skjulte kolonner</Heading>
            <Flex gap="4px">
              {Object.entries(columnVisibility)
                .filter(([_, visible]) => !visible)
                .map(([name, _]) => (
                  <Tag key={name}>
                    <TagLabel>{name}</TagLabel>
                    <TagCloseButton onClick={() => unHideColumn(name)} />
                  </Tag>
                ))}
            </Flex>
          </Flex>
        )}
        {showSearch && <DataTableSearch table={table} />}
      </Flex>
      <TableContainer>
        <Table variant="striped">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) =>
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row
                  .getVisibleCells()
                  .map((cell) =>
                    flexRender(cell.column.columnDef.cell, cell.getContext())
                  )}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
