import { Box, Heading, Select } from '@kvib/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { ActiveFilter, Option } from '../../types/tableTypes';

export type Filters = {
  filterName: string;
  filterOptions: Option | null;
  activeFilters: ActiveFilter[];
  setActiveFilters: Dispatch<SetStateAction<ActiveFilter[]>>;
};

export const Filter = ({
  filterName,
  filterOptions,
  activeFilters,
  setActiveFilters,
}: Filters) => {
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
      <Box style={{ margin: 20, maxWidth: 210 }}>
        <Heading style={{ marginBottom: 10 }} size={'sm'}>
          {filterName}
        </Heading>
        <Select
          aria-label="select"
          placeholder={placeholder}
          onChange={handleFilterChange}
          value={currentValue}
        >
          {filterOptions?.choices.map((choice) => (
            <option value={choice.name} key={choice.name}>
              {choice.name}
            </option>
          ))}
        </Select>
      </Box>
    )
  );
};
