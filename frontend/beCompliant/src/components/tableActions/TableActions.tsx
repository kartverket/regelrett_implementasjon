import { Flex } from '@kvib/react';
import { Filter, Filters } from './TableFilter';
import { TableSorter, SortedBy } from './TableSorter';
import { TableMetaData } from '../../types/tableTypes';

interface Props {
  filters: Filters;
  tableMetadata: TableMetaData;
  sortedBy: SortedBy;
}

export const Actions = ({
  filters: tableFilterProps,
  tableMetadata,
  sortedBy: tableSorterProps,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;

  const { fieldSortedBy, setFieldSortedBy } = tableSorterProps;

  return (
    tableMetadata && (
      <>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
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
          <Flex>
            <TableSorter
              fieldSortedBy={fieldSortedBy}
              setFieldSortedBy={setFieldSortedBy}
            />
          </Flex>
        </Flex>
      </>
    )
  );
};
