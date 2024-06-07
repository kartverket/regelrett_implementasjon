import { Box, Select, Heading } from '@kvib/react';
import { Dispatch, SetStateAction, useState } from 'react';
import { Option } from '../../hooks/datafetcher';
import { ActiveFilter } from '../../pages/Table';

export type TableFilterProps = {
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
}: TableFilterProps) => {
  const [currentValue, setCurrentValue] = useState<string | undefined>(
    activeFilters.find((filter) => filter.filterName === filterName)
      ?.filterValue
  );

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
          placeholder="Alle"
          onChange={handleFilterChange}
          value={currentValue}
        >
          {filterOptions?.choices.map((choice, index) => (
            <option value={choice.name} key={index}>
              {choice.name}
            </option>
          ))}
        </Select>
      </Box>
    )
  );
};
