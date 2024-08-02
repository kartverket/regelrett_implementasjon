import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { TableCell } from './table/TableCell';
import { Field, RecordType } from '../types/tableTypes';
import { formatDateTime } from '../utils/formatTime';
import { useColumnVisibility } from '../hooks/useColumnVisibility';

type TableComponentProps = {
  data: RecordType[];
  fields: Field[];
};

export function TableComponent({ data, fields }: TableComponentProps) {
  const [
    columnVisibility,
    setColumnVisibility,
    unHideColumn,
    hasHiddenColumns,
  ] = useColumnVisibility();
  const columns: ColumnDef<any, any>[] = fields.map((field, index) => ({
    header: ({ column }) => (
      <DataTableHeader
        column={column}
        header={field.name}
        setColumnVisibility={setColumnVisibility}
      />
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

  columns.push({
    header: ({ column }) => {
      return (
        <DataTableHeader
          column={column}
          header={'Når'}
          setColumnVisibility={setColumnVisibility}
        />
      );
    },
    id: 'Når',
    accessorFn: (row) => row.fields['updated'] ?? '',
    cell: ({ cell, getValue, row }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <TableCell
          row={row}
          value={getValue() ? formatDateTime(getValue()) : 'Ikke oppdatert'}
          column={{
            id: `updated-${cell.id}`,
            name: 'Når',
            type: 'date',
            options: null,
          }}
        />
      </DataTableCell>
    ),
  });

  const table = useReactTable({
    columns: columns,
    data: data,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return (
    <DataTable
      table={table}
      unHideColumn={unHideColumn}
      hasHiddenColumns={hasHiddenColumns}
    />
  );
}
