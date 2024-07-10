import { Table, TableContainer, Tbody, Th, Thead, Tr } from '@kvib/react';
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { QuestionRow } from './questionRow/QuestionRow';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { Question } from './table/Question';
import { formatDateTime } from '../utils/formatTime';
import { Choice, Field, RecordType } from '../types/tableTypes';

type NewTableComponentProps = {
  data: RecordType[];
  fields: Field[];
};

export function NewTableComponent({ data, fields }: NewTableComponentProps) {
  const columns: ColumnDef<any, any>[] = fields.map((field) => ({
    header: ({ column }) => (
      <DataTableHeader column={column} header={field.name} />
    ),
    id: field.name,
    accessorFn: (row) => {
      return Array.isArray(row.fields[field.name])
        ? row.fields[field.name].join(', ')
        : row.fields[field.name];
    },
    cell: ({ cell, getValue }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <Question value={getValue()} column={field} />
      </DataTableCell>
    ),
  }));

  columns.push({
    header: ({ column }) => {
      return <DataTableHeader column={column} header={'Når'} />;
    },
    id: 'Når',
    accessorFn: (row) => row.fields['updated'] ?? '',
    cell: ({ cell, getValue }: CellContext<any, any>) => (
      <DataTableCell cell={cell}>
        <Question
          value={getValue() ? formatDateTime(getValue()) : 'Ikke updatert'}
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
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  return <DataTable table={table} />;
}

// delete this type and component when new table component using DataTable is finished,
// the thing that is missing the handling of the Answer component.
type TableComponentProps = {
  data: RecordType[];
  fields: Field[];
  choices: Choice[];
  team?: string;
};

export function TableComponent({
  data,
  fields,
  choices,
  team,
}: TableComponentProps) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            {fields.map((field) => (
              <Th key={field.id}>{field.name}</Th>
            ))}
            <Th key={'when-header'}>Når</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: RecordType) => (
            <QuestionRow
              key={item.fields.ID}
              record={item}
              choices={choices}
              tableColumns={fields}
              team={team}
            />
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
