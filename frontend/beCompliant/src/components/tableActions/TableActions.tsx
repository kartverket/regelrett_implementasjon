import { Flex, Heading, Icon } from '@kvib/react';
import { TableFilter, TableFilters } from './TableFilter';
import { TableMetaData } from '../../types/tableTypes';

interface Props {
  filters: TableFilters;
  tableMetadata: TableMetaData;
}

export const TableActions = ({
  filters: tableFilterProps,
  tableMetadata,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;

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

        {tableMetadata?.fields.map((metaColumn) => (
          <TableFilter
            key={metaColumn.id}
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
