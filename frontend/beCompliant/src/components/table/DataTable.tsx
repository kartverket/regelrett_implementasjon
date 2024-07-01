import {flexRender, Table as TanstackTable} from "@tanstack/react-table";
import {Table, TableContainer, Tbody, Thead, Tr} from '@kvib/react';


interface Props<TData> {
    table: TanstackTable<TData>
}


export function DataTable<TData>({table}: Props<TData>) {
    return (
        <TableContainer>
            <Table variant="striped" colorScheme="gray">
                <Thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map(header =>
                                flexRender(header.column.columnDef.header, header.getContext())
                            )}
                        </Tr>
                    ))}
                </Thead>
                <Tbody>
                    {table.getRowModel().rows.map(row =>
                        <Tr key={row.id}>
                            {row.getVisibleCells().map(cell => (
                                flexRender(cell.column.columnDef.cell, cell.getContext())))}
                        </Tr>
                    )}
                </Tbody>
            </Table>
        </TableContainer>
    )
}