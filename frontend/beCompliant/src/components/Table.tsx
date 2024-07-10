import {
  Flex,
  IconButton,
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
import { HiddenColumn } from '../pages/TablePage';
import { QuestionRow } from './questionRow/QuestionRow';
import { DataTable } from './table/DataTable';
import { DataTableCell } from './table/DataTableCell';
import { DataTableHeader } from './table/DataTableHeader';
import { Question } from './table/Question';
import { RecordType, Field, Choice } from '../types/tableTypes';

type NewTableComponentProps = {
  data: RecordType[];
  fields: Field[];
  columnVisibility: Record<string, boolean>;
  setColumnVisibility: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >;
};

export function NewTableComponent({
  data,
  fields,
  columnVisibility,
  setColumnVisibility,
}: NewTableComponentProps) {
  const columns: ColumnDef<any, any>[] = fields.map((field) => ({
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
    state: {
      columnVisibility,
    },
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
  hiddenColumns: HiddenColumn[];
  setHiddenColumns: React.Dispatch<React.SetStateAction<HiddenColumn[]>>;
};

export function TableComponent({
  data,
  fields,
  choices,
  team,
  hiddenColumns,
  setHiddenColumns,
}: TableComponentProps) {
  return (
    <TableContainer>
      <Table variant="striped" colorScheme="gray">
        <Thead>
          <Tr>
            <Th>Når</Th>
            {fields?.map((field, index) => {
              if (
                !hiddenColumns.map((column) => column.index).includes(index)
              ) {
                return (
                  <Th key={field.id}>
                    <Flex alignItems="center" gap="4px">
                      {field.name}
                      <IconButton
                        variant="tertiary"
                        size="xs"
                        onClick={() => {
                          setHiddenColumns(
                            (prev: HiddenColumn[]) =>
                              [
                                ...prev,
                                { name: field.name, index: index },
                              ] as HiddenColumn[]
                          );
                        }}
                        aria-label={'Remove column from table'}
                        icon={'close'}
                      ></IconButton>
                    </Flex>
                  </Th>
                );
              }
            })}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((item: RecordType) => (
            <QuestionRow
              hiddenColumns={hiddenColumns}
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
