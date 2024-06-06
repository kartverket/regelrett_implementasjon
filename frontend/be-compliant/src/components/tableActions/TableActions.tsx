import { Flex, Heading } from '@kvib/react';
import { TableFilter, TableFilterProps } from './TableFilter';
import { TableMetaData } from '../../hooks/datafetcher';
import { TableSorter, TableSorterProps } from './TableSorter';
import { useParams } from 'react-router-dom';

interface TableActionProps {
  tableFilterProps: TableFilterProps;
  tableMetadata: TableMetaData;
  tableSorterProps: TableSorterProps;
}
export const TableActions = (props: TableActionProps) => {
  const { tableFilterProps, tableMetadata, tableSorterProps } = props;

  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;

  const { fieldSortedBy, setFieldSortedBy } = tableSorterProps;

  const params = useParams();
  const team = params.teamName;

  return (
    tableMetadata && (
      <>
        <Heading style={{ margin: 20 }}>{team}</Heading>
        <Flex alignItems="center" justifyContent="space-between">
          <Flex>
            <TableFilter
              filterOptions={filterOptions}
              filterName={'Status'}
              activeFilters={activeFilters}
              setActiveFilters={setActiveFilters}
            />

            {tableMetadata?.fields.map((metaColumn, index) => (
              <TableFilter
                key={index}
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
