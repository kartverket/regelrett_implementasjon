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
import { useState } from 'react';
import { ActiveFilter } from '../../types/tableTypes';
import { Option } from '../../api/types';

export type TableFilters = {
  filterName: string;
  filterOptions: Option[] | null;
  activeFilters: ActiveFilter[];
  setActiveFilters: (activeFilters: ActiveFilter[]) => void;
};

export const TableFilter = ({
  filterName,
  filterOptions,
  activeFilters,
  setActiveFilters,
}: TableFilters) => {
  const placeholder = 'Alle';
  const activeFilterValue = activeFilters.find(
    (filter) => filter.filterName === filterName
  )?.filterValue;

  const [currentValue, setCurrentValue] = useState<string | undefined>(
    activeFilterValue ?? placeholder
  );

  const handleFilterChange = (filterValue?: Option): void => {
    setCurrentValue(filterValue?.name);

    const updatedFilters = activeFilters.filter(
      (filter) => filter.filterName !== filterName
    );

    if (filterValue) {
      updatedFilters.push({
        filterName: filterName,
        filterValue: filterValue.name,
      });
    }

    setActiveFilters(updatedFilters);
  };

  const optionsCollection = createListCollection({
    items: filterOptions ?? [],
    itemToString: (option) => option.name,
    itemToValue: (option) => option.name,
  });

  return (
    filterOptions && (
      <Flex flexDirection="column" gap="1">
        <Text textStyle="md" fontWeight="bold" color="blue.500">
          {filterName}
        </Text>
        <SelectRoot
          aria-label="select"
          collection={optionsCollection}
          colorPalette="blue"
          onValueChange={(event) => handleFilterChange(event.items[0])}
          value={currentValue ? [currentValue] : []}
          background="white"
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
              <SelectItem item={option} key={option.name}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Flex>
    )
  );
};
