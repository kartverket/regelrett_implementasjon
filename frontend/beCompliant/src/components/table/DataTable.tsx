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
import { FILLMODE_COLUMNS } from '../../utils/fillmodeColumns';
import { CSVDownload } from '../CSVDownload';
import { DataTableSearch } from './DataTableSearch';
import { PaginationButtonContainer } from './pagination/PaginationButtonContainer';
import { TableStateProvider } from './TableState';

interface Props<TData> {
  table: TanstackTable<TData>;
  showSearch?: boolean;
  unHideColumn: (name: string) => void;
  unHideColumns: () => void;
  hasHiddenColumns?: boolean;
  showOnlyFillModeColumns: (name: string[]) => void;
  getShownColumns: (
    record: Record<string, boolean>,
    keysToCheck: string[]
  ) => string[];
}

export function DataTable<TData>({
  table,
  showSearch = true,
  unHideColumn,
  unHideColumns,
  hasHiddenColumns = false,
  getShownColumns,
  showOnlyFillModeColumns,
}: Props<TData>) {
  const columnVisibility = table.getState().columnVisibility;
  const theme = useTheme();
  const headerNames = table.getAllColumns().map((column) => column.id);

  const handleOnChange = () => {
    const currentShownColumns = JSON.stringify(
      getShownColumns(columnVisibility, headerNames)
    );
    const isFillMode = currentShownColumns === JSON.stringify(FILLMODE_COLUMNS);

    if (isFillMode) {
      unHideColumns();
    } else {
      showOnlyFillModeColumns(headerNames);
      headerNames.forEach((header) => table.getColumn(header)?.clearSorting());
      FILLMODE_COLUMNS.forEach(unHideColumn);
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
          justifyContent={hasHiddenColumns ? 'space-between' : 'flex-end'}
          alignItems="end"
          width="100%"
          paddingX="10"
        >
          {hasHiddenColumns && (
            <Flex direction="column" gap="2">
              <Heading size="xs" fontWeight="semibold">
                Skjulte kolonner
              </Heading>
              <Flex gap="1" alignItems="center" flexWrap="wrap">
                <Button
                  aria-label={'Show all columns'}
                  onClick={() => unHideColumns()}
                  colorScheme="blue"
                  size="xs"
                >
                  <Text size="md" variant="solid" colorScheme="blue">
                    Vis alle kolonner
                  </Text>
                </Button>
                <Divider height="5" orientation="vertical" />
                {Object.entries(columnVisibility)
                  .filter(([_, visible]) => !visible)
                  .map(([name, _]) => (
                    <Tag
                      colorScheme="blue"
                      variant="subtle"
                      size="md"
                      key={name}
                    >
                      <TagLabel>{name}</TagLabel>
                      <TagCloseButton onClick={() => unHideColumn(name)} />
                    </Tag>
                  ))}
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
              >
                Utfyllingsmodus
              </Text>
              <Switch
                onChange={handleOnChange}
                colorScheme="blue"
                isChecked={
                  JSON.stringify(
                    getShownColumns(columnVisibility, headerNames)
                  ) === JSON.stringify(FILLMODE_COLUMNS)
                }
              />
            </Flex>
            <Text
              maxWidth="350px"
              fontSize="small"
              color={theme.colors.gray[500]}
            >
              Viser kun essensielle kolonner slik at det blir mer oversiktlig å
              fylle inn data.
            </Text>
            {showSearch && <DataTableSearch table={table} />}
          </Flex>
        </Flex>
        <TableContainer background="white" paddingX="3">
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
