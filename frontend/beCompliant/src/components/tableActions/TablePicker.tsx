import { Flex, FlexProps, Select, Spinner, Text } from '@kvib/react';
import { Table } from '../../api/types';
import { ActiveFilter } from '../../types/tableTypes';

export type TablePickerProps = {
  tables: Table[];
  activeTableId?: string;
  setActiveTableId: (tableId: string) => void;
  setActiveFilters: (filters: ActiveFilter[]) => void;
  flexProps?: FlexProps;
};

export const TablePicker = ({
  tables,
  activeTableId,
  setActiveTableId,
  setActiveFilters,
  flexProps,
}: TablePickerProps) => {
  if (!activeTableId) {
    return <Spinner />;
  }

  return (
    <Flex flexDirection="column" gap="1" {...flexProps}>
      <Text size="md" as="b" color="blue.500">
        Skjema/Tabell
      </Text>
      <Select
        aria-label="select"
        onChange={(e) => {
          setActiveTableId(e.target.value);
          setActiveFilters([]);
        }}
        value={activeTableId}
        background="white"
        width="210px"
        maxWidth="210px"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
      >
        {tables?.map((table) => (
          <option value={table.id} key={table.id}>
            {table.name}
          </option>
        ))}
      </Select>
    </Flex>
  );
};
