import { Flex, Heading, Icon } from '@kvib/react';
import { TableFilter, TableFilters } from './TableFilter';
import { Field } from '../../api/types';
import { useEffect } from 'react';

interface Props {
  filters: TableFilters;
  tableMetadata: Field[];
}

export const TableActions = ({
  filters: { filterOptions, activeFilters, setActiveFilters },
  tableMetadata,
}: Props) => {
  useEffect(() => {
    const storedFilter = localStorage.getItem('filters');
    const parsedFilter = storedFilter ? JSON.parse(storedFilter) : {};
    if (parsedFilter && Object.keys(parsedFilter).length > 0) {
      setActiveFilters(parsedFilter);
    }
  }, [setActiveFilters]);

  useEffect(() => {
    if (activeFilters && Object.keys(activeFilters).length > 0) {
      localStorage.setItem('filters', JSON.stringify(activeFilters));
    }
  }, [activeFilters]);

  return (
    <Flex flexDirection="column" gap="2" marginX="10">
      <Flex gap="2" alignItems="center">
        <Icon icon="filter_list" />
        <Heading size="sm" as="h4" fontWeight="normal">
          FILTER
        </Heading>
      </Flex>
      <Flex alignItems="center" gap="4" flexWrap="wrap">
        <TableFilter
          filterOptions={filterOptions}
          filterName="Status"
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        {tableMetadata.map((metaColumn) => (
          <TableFilter
            key={metaColumn.name}
            filterName={metaColumn.name}
            filterOptions={metaColumn.options}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />
        ))}
      </Flex>
    </Flex>
  );
};
