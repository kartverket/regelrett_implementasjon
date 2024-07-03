import {
  Button,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@kvib/react';
import {
  CellContext,
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Choice, Field } from '../hooks/datafetcher';
import { RecordType } from '../pages/TablePage';
import { QuestionRow } from './questionRow/QuestionRow';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { Question } from './table/Question';

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
  hiddenIndices: number[];
  setHiddenIndices: any;
};

export function TableComponent({
  data,
  fields,
  choices,
  team,
  hiddenIndices,
  setHiddenIndices,
}: TableComponentProps) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Når</Th>
            {fields?.map((field, index) => {
              if (!hiddenIndices.includes(index)) {
                return (
                  <Th key={field.id}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'baseline',
                        gap: '4px',
                      }}
                    >
                      {field.name}{' '}
                      <Button
                        variant="tertiary"
                        size="xs"
                        onClick={(e) => {
                          setHiddenIndices((prev: any) => [...prev, index]);
                        }}
                      >
                        X
                      </Button>
                    </div>
                  </Th>
                );
              }
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: RecordType) => (
            <QuestionRow
              hiddenIndices={hiddenIndices}
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
