import { flexRender, Table as TanstackTable } from '@tanstack/react-table';
import {
  Divider,
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
import React from 'react';
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
    <Flex flexDirection="column" w="100%" gap={'4'}>
      <Flex
        justifyContent={hasHiddenColumns ? 'space-between' : 'flex-end'}
        alignItems={'end'}
        w="100%"
        mx={'10'}
      >
        {hasHiddenColumns && (
          <Flex direction="column" gap="2">
            <Heading size="xs" fontWeight={'semibold'}>
              Skjulte kolonner
            </Heading>
            <Flex gap="1">
              {/*TDOD FIX BUTTON */}
              <button onClick={() => {}}>
                <Tag
                  height={'26px'}
                  size="sm"
                  variant={'solid'}
                  colorScheme={'blue'}
                >
                  Vis alle kolonner
                </Tag>
              </button>
              {/* TODO Fix divider height */}
              <Divider
                my={'0.5'}
                borderColor={'gray.500'}
                orientation={'vertical'}
              />
              {Object.entries(columnVisibility)
                .filter(([_, visible]) => !visible)
                .map(([name, _]) => (
                  <Tag
                    colorScheme={'blue'}
                    varaint="subtle"
                    size={'sm'}
                    key={name}
                  >
                    <TagLabel>{name}</TagLabel>
                    <TagCloseButton onClick={() => unHideColumn(name)} />
                  </Tag>
                ))}
            </Flex>
          </Flex>
        )}
        {/* TODO FIX MARGIN RIGHT*/}
        {showSearch && <DataTableSearch mr="80px" table={table} />}
      </Flex>
      <TableContainer bg={'white'} px={'3'}>
        <Table variant="striped">
          {/* TODO FIX MARGINS TABLE HEADER */}
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <React.Fragment key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </React.Fragment>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <React.Fragment key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </React.Fragment>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Flex>
  );
}
