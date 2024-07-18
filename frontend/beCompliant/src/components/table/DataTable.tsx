import { flexRender, Table as TanstackTable } from '@tanstack/react-table';
import { Flex, Table, TableContainer, Tbody, Thead, Tr } from '@kvib/react';
import { DataTableSearch } from './DataTableSearch';

interface Props<TData> {
  table: TanstackTable<TData>;
  showSearch?: boolean;
}

export function DataTable<TData>({ table, showSearch = true }: Props<TData>) {
  return (
    <Flex flexDirection="column">
      {showSearch && (
        <DataTableSearch alignSelf={'flex-end'} table={table} mr={10} />
      )}
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
