import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Choice, Field } from '../hooks/datafetcher';
import { RecordType } from '../pages/TablePage';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { Question } from './table/Question';

type TableComponentProps = {
  data: RecordType[];
  fields: Field[];
  team?: string;
  choices: Choice[];
};

export function TableComponent({ data, fields }: TableComponentProps) {
  const columns: ColumnDef<any, any>[] = fields.map((field) => ({
    header: ({ column }) => (
      <DataTableHeader column={column} header={field.name} />
    ),
    accessorKey: 'fields.' + field.name,
    cell: ({ cell, getValue }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <Question value={getValue()} column={field} />
      </DataTableCell>
    ),
  }));

  const table = useReactTable({
    columns: columns,
    data: data,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  return <DataTable table={table} />;
}
