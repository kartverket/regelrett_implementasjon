import {
  createListCollection,
  Flex,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Text,
} from '@kvib/react';
import { useSearchParams } from 'react-router';
import { Column } from '@tanstack/react-table';
import { ActiveFilter } from '../../types/tableTypes';

type TableFilters<TData> = {
  filterName: string;
  filterOptions: { name: string; value: any }[];
  column: Column<TData, unknown>;
  formId: string;
};

export const TableFilter = <TData,>({
  filterName,
  filterOptions,
  column,
  formId,
}: TableFilters<TData>) => {
  const placeholder = 'Alle';
  const [_, setSearchParams] = useSearchParams();

  const handleFilterChange = (filterValue?: {
    name: string;
    value: string;
  }): void => {
    column.setFilterValue(filterValue?.value);

    const updatedLocalStorageFilters = JSON.parse(
      localStorage.getItem(`filters_${formId}`) || `[]`
    ).filter((filter: ActiveFilter) => filter.id !== column.id);

    setSearchParams(
      (current) => {
        current.getAll('filter').forEach((value) => {
          if (value.startsWith(column.id)) {
            current.delete('filter', value);
          }
        });
        if (filterValue)
          current.append('filter', `${column.id}_${filterValue?.value}`);
        return current;
      },
      { replace: true }
    );

    localStorage.setItem(
      `filters_${formId}`,
      JSON.stringify(
        !filterValue
          ? updatedLocalStorageFilters
          : [
              ...updatedLocalStorageFilters,
              {
                id: column.id,
                value: filterValue?.value,
              },
            ]
      )
    );
  };

  const optionsCollection = createListCollection({
    items: filterOptions ?? [],
    itemToString: (option) => option.name,
    itemToValue: (option) => option.value,
  });
  const value = column.getFilterValue();

  return (
    <Flex flexDirection="column" gap="1">
      <Text textStyle="md" fontWeight="bold" color="blue.500">
        {filterName}
      </Text>
      <SelectRoot
        aria-label="select"
        collection={optionsCollection}
        colorPalette="blue"
        onValueChange={(event) => handleFilterChange(event.items[0])}
        backgroundColor="white"
        value={typeof value == 'string' ? [value] : []}
        width="210px"
        maxWidth="210px"
        textOverflow="ellipsis"
        whiteSpace="nowrap"
        deselectable
      >
        <SelectTrigger>
          <SelectValueText placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {optionsCollection.items.map((option) => (
            <SelectItem item={option} key={option.value}>
              {option.name}
            </SelectItem>
          ))}
        </SelectContent>
      </SelectRoot>
    </Flex>
  );
};
