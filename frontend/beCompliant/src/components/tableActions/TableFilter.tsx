import { Flex, Select, Text } from '@kvib/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ActiveFilter, Option } from '../../types/tableTypes';

export type TableFilters = {
  filterName: string;
  filterOptions: Option | null;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
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
    activeFilterValue
  );

  useEffect(() => {
    setCurrentValue(activeFilterValue ?? placeholder);
  }, [activeFilters]);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const filterValue = filterOptions?.choices.find(
      (choice) => choice.name === event.target.value
    );
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

  return (
    filterOptions &&
    filterOptions.choices && (
      <Flex flexDirection="column" gap="1">
        <Text size="md" as="b" color="blue.500">
          {filterName}
        </Text>
        <Select
          aria-label="select"
          placeholder={placeholder}
          onChange={handleFilterChange}
          value={currentValue}
          background="white"
          width="210px"
          maxWidth="210px"
          textOverflow="ellipsis"
          whiteSpace="nowrap"
        >
          {filterOptions?.choices.map((choice) => (
            <option value={choice.name} key={choice.name}>
              {choice.name}
            </option>
          ))}
        </Select>
      </Flex>
    )
  );
};
