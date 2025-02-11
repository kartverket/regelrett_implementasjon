import {
  Button,
  Divider,
  Flex,
  Heading,
  Switch,
  Table,
  TableContainer,
  Tag,
  TagCloseButton,
  TagLabel,
  Tbody,
  Text,
  Thead,
  Tr,
  useTheme,
} from '@kvib/react';
import { Table as TanstackTable, flexRender } from '@tanstack/react-table';
import React from 'react';
import { Question } from '../../api/types';
import { CSVDownload } from '../CSVDownload';
import { DataTableSearch } from './DataTableSearch';
import { PaginationButtonContainer } from './pagination/PaginationButtonContainer';
import { TableStateProvider } from './TableState';

interface Props<TData> {
  table: TanstackTable<TData>;
  showSearch?: boolean;
  unHideColumn: (name: string) => void;
  unHideColumns: (name: string[]) => void;
  showOnlyFillModeColumns: (name: string[]) => void;
}

export function DataTable<TData>({
  table,
  showSearch = true,
  unHideColumn,
  unHideColumns,
  showOnlyFillModeColumns,
}: Props<TData>) {
  const theme = useTheme();
  const headerNames = table.getAllColumns().map((column) => column.id);

  const handleOnChange = (isDetailViewChecked: boolean) => {
    if (!isDetailViewChecked) {
      showOnlyFillModeColumns(headerNames);
    } else {
      unHideColumns(headerNames);
    }
  };

  return (
    <TableStateProvider>
      <Flex flexDirection="column" width="100%" gap="4">
        <CSVDownload
          rows={
            table
              .getFilteredRowModel()
              .rows.map((row) => row.original) as Question[]
          }
          headerArray={headerNames}
          alignSelf="flex-end"
          marginRight="10"
        />
        <Flex
          justifyContent={
            table.getIsAllColumnsVisible() ? 'flex-end' : 'space-between'
          }
          alignItems="end"
          width="100%"
          paddingX="10"
        >
          {!table.getIsAllColumnsVisible() && (
            <Flex direction="column" gap="2">
              <Heading size="xs" fontWeight="semibold">
                Skjulte kolonner
              </Heading>
              <Flex gap="1" alignItems="center" flexWrap="wrap">
                <Button
                  aria-label={'Show all columns'}
                  onClick={() => {
                    unHideColumns(headerNames);
                  }}
                  colorScheme="blue"
                  size="xs"
                >
                  <Text size="md" variant="solid" colorScheme="blue">
                    Vis alle kolonner
                  </Text>
                </Button>
                <Divider height="5" orientation="vertical" />

                {table.getAllLeafColumns().map(
                  (column) =>
                    !column.getIsVisible() && (
                      <Tag
                        colorScheme="blue"
                        variant="subtle"
                        size="md"
                        key={column.id}
                      >
                        <TagLabel>{column.id}</TagLabel>
                        <TagCloseButton
                          onClick={() => {
                            unHideColumn(column.id);
                          }}
                        />
                      </Tag>
                    )
                )}
              </Flex>
            </Flex>
          )}
          <Flex alignItems="center" gap={3}>
            <Flex
              alignItems="center"
              flexDirection="row"
              backgroundColor={theme.colors.blue[50]}
              padding={4}
              borderRadius="5px"
              maxHeight="28px"
            >
              <Text
                fontWeight="bold"
                marginRight="15px"
                color={theme.colors.gray[700]}
                w="130px"
              >
                Detaljert visning
              </Text>
              <Switch
                onChange={(e) => handleOnChange(e.target.checked)}
                colorScheme="blue"
                isChecked={table.getIsAllColumnsVisible()}
              />
            </Flex>
            <Text
              maxWidth="350px"
              fontSize="small"
              color={theme.colors.gray[500]}
            >
              Skru av for å kun vise essensielle kolonner for en ryddigere
              visning
            </Text>
            {showSearch && <DataTableSearch table={table} />}
          </Flex>
        </Flex>
        <TableContainer backgroundColor="white" paddingX="3">
          <Table variant="striped">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </React.Fragment>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <PaginationButtonContainer table={table} />
      </Flex>
    </TableStateProvider>
  );
}
