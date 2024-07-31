import { Flex } from '@kvib/react';
import { Filter, Filters } from './TableFilter';
import { TableMetaData } from '../../types/tableTypes';

interface Props {
  filters: Filters;
  tableMetadata: TableMetaData;
}

export const Actions = ({
  filters: tableFilterProps,
  tableMetadata,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;

  return (
    tableMetadata && (
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexWrap="wrap">
          <Filter
            filterOptions={filterOptions}
            filterName={'Status'}
            activeFilters={activeFilters}
            setActiveFilters={setActiveFilters}
          />

          {tableMetadata?.fields.map((metaColumn) => (
            <Filter
              key={metaColumn.id}
              filterName={metaColumn.name}
              filterOptions={metaColumn.options}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />
          ))}
        </Flex>
      </Flex>
    )
  );
};
