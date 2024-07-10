import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Field, RecordType } from '../types/tableTypes';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { TableCell } from './table/TableCell';

type TableComponentProps = {
  data: RecordType[];
  fields: Field[];
};

export function TableComponent({ data, fields }: TableComponentProps) {
  const columns: ColumnDef<any, any>[] = fields.map((field, index) => ({
    header: ({ column }) => (
      <DataTableHeader column={column} header={field.name} />
    ),
    id: field.name,
    accessorFn: (row) => {
      return Array.isArray(row.fields[field.name])
        ? row.fields[field.name].join(',')
        : row.fields[field.name];
    },
    cell: ({ cell, getValue, row }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <TableCell
          value={getValue()}
          column={field}
          row={row}
          answerable={index == 3}
        />
      </DataTableCell>
    ),
  }));

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return <DataTable table={table} />;
}
