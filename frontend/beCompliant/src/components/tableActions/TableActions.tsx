import { Flex } from '@kvib/react';
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
    tableMetadata && (
      <Flex alignItems="center" justifyContent="space-between">
        <Flex flexWrap="wrap">
          <TableFilter
            filterOptions={filterOptions}
            filterName={'Status'}
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
    )
  );
};
