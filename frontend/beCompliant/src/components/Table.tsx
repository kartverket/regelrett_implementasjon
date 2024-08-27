import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  RowData,
  useReactTable,
} from '@tanstack/react-table';
import { useParams } from 'react-router-dom';
import { useColumnVisibility } from '../hooks/useColumnVisibility';
import { formatDateTime } from '../utils/formatTime';
import { Comment } from './table/Comment';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { TableCell } from './table/TableCell';
import { Field, OptionalFieldType, Question, Table } from '../api/types';

type TableComponentProps = {
  data: Question[];
  tableData: Table;
};

export function TableComponent({ data, tableData }: TableComponentProps) {
  const params = useParams();
  const team = params.teamName;

  const [
    columnVisibility,
    setColumnVisibility,
    unHideColumn,
    unHideColumns,
    hasHiddenColumns,
    showOnlyFillModeColumns,
    getShownColumns,
  ] = useColumnVisibility();

  const columns: ColumnDef<any, any>[] = tableData.fields.map(
    (field, index) => ({
      header: ({ column }) => (
        <DataTableHeader
          column={column}
          header={field.name}
          setColumnVisibility={setColumnVisibility}
          minWidth={field.name.toLowerCase() === 'id' ? '120px' : undefined}
        />
      ),
      id: field.name,
      accessorFn: (row: Question) => {
        if (row.metadata.optionalFields) {
          return row.metadata.optionalFields.find(
            (col) => col.key === field.name
          );
        } else {
          return null;
        }
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
    })
  );

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
    accessorFn: (row) => row.answers[0]?.updated ?? '',
    cell: ({ cell, getValue, row }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <TableCell
          row={row}
          value={getValue() ? formatDateTime(getValue()) : 'Ikke oppdatert'}
          column={{
            name: 'Når',
            type: OptionalFieldType.DATE,
            options: null,
          }}
        />
      </DataTableCell>
    ),
  });

  const commentColumn: ColumnDef<any, any> = {
    header: ({ column }) => {
      return (
        <DataTableHeader
          column={column}
          header={'Kommentar'}
          setColumnVisibility={setColumnVisibility}
        />
      );
    },
    id: 'Kommentar',
    accessorFn: (row) => row.comments[0]?.comment ?? '',
    cell: ({ cell, getValue, row }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <Comment
          comment={getValue()}
          questionId={row.original.id}
          team={team}
        />
      </DataTableCell>
    ),
  };

  // Find the index of the column where field.name is "Svar"
  const svarIndex = columns.findIndex((column) => column.id === 'Svar');

  // If the column is found, inject the new column right after it
  if (svarIndex !== -1) {
    columns.splice(svarIndex + 1, 0, commentColumn);
  } else {
    // If not found, push it at the end (or handle it differently as needed)
    columns.push(commentColumn);
  }

  const table = useReactTable({
    columns: columns,
    data: data,
    state: {
      columnVisibility,
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });

  return (
    <DataTable<RowData>
      table={table}
      unHideColumn={unHideColumn}
      unHideColumns={unHideColumns}
      hasHiddenColumns={hasHiddenColumns}
      showOnlyFillModeColumns={showOnlyFillModeColumns}
      getShownColumns={getShownColumns}
    />
  );
}
