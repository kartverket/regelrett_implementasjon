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
    value: any;
  }): void => {
    console.log(filterValue);

    column.setFilterValue(filterValue?.value);

    const updatedLocalStorageFilters = JSON.parse(
      localStorage.getItem(`filters_${formId}`) || `[]`
    ).filter((filter: ActiveFilter) => filter.id !== column.id);

    if (!filterValue) {
      setSearchParams(
        (current) => {
          current.getAll('filter').forEach((filterValue) => {
            if (filterValue.startsWith(column.id)) {
              current.delete('filter', filterValue);
            }
          });
          return current;
        },
        { replace: true }
      );
      localStorage.setItem(
        `filters_${formId}`,
        JSON.stringify(updatedLocalStorageFilters)
      );
    } else {
      setSearchParams((current) => {
        current.getAll('filter').forEach((filterValue) => {
          if (filterValue.startsWith(column.id)) {
            current.delete('filter', filterValue);
          }
        });
        current.append('filter', `${column.id}_${filterValue?.value}`);
        return current;
      });

      localStorage.setItem(
        `filters_${formId}`,
        JSON.stringify([
          ...updatedLocalStorageFilters,
          {
            id: column.id,
            value: filterValue?.value,
          },
        ])
      );
    }
  };

  const optionsCollection = createListCollection({
    items: filterOptions ?? [],
    itemToString: (option) => option.name,
    itemToValue: (option) => option.value,
  });

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
        value={
          column.getFilterValue() ? ([column.getFilterValue()] as string[]) : []
        }
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
