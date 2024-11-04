import { Flex, Heading, Icon } from '@kvib/react';
import { Column } from '../../api/types';
import { TableFilter, TableFilters } from './TableFilter';

interface Props {
  filters: TableFilters;
  tableMetadata: Column[];
  filterByAnswer: boolean;
}

export const TableActions = ({
  filters: { filterOptions, activeFilters, setActiveFilters },
  tableMetadata,
  filterByAnswer,
}: Props) => {
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

        {tableMetadata
          .filter(({ name }) => filterByAnswer || name !== 'Svar')
          .map((metaColumn) => (
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
