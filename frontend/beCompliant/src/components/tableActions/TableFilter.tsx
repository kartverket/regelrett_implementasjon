import { Flex, Select, Text } from '@kvib/react';
import { useEffect, useState } from 'react';
import { ActiveFilter } from '../../types/tableTypes';
import { Option, OptionalFieldType } from '../../api/types';

export type TableFilters = {
  filterName: string;
  filterOptions: Option[] | null;
  activeFilters: ActiveFilter[];
  type?: string;
  setActiveFilters: (activeFilters: ActiveFilter[]) => void;
};

export const TableFilter = ({
  filterName,
  filterOptions,
  activeFilters,
  type,
  setActiveFilters,
}: TableFilters) => {
  const placeholder = 'Alle';
  const activeFilterValue = activeFilters.find(
    (filter) => filter.filterName === filterName
  )?.filterValue;

  const [currentValue, setCurrentValue] = useState<string | undefined>(
    activeFilterValue
  );

  if (
    filterName === 'Svar' &&
    type !==
      (OptionalFieldType.OPTION_SINGLE || OptionalFieldType.OPTION_MULTIPLE)
  ) {
    filterOptions = null;
  }

  useEffect(() => {
    setCurrentValue(activeFilterValue ?? placeholder);
  }, [activeFilters]);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const filterValue = filterOptions?.find(
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
    filterOptions && (
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
          {filterOptions?.map((choice) => (
            <option value={choice.name} key={choice.name} color={choice.color}>
              {choice.name}
            </option>
          ))}
        </Select>
      </Flex>
    )
  );
};
