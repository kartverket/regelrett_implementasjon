import { Flex, Heading, Icon } from '@kvib/react';
import { TableFilter, TableFilters } from './TableFilter';
import { Field } from '../../api/types';

interface Props {
  filters: TableFilters;
  tableMetadata: Field[];
}

export const TableActions = ({
  filters: tableFilterProps,
  tableMetadata,
}: Props) => {
  const { filterOptions, activeFilters, setActiveFilters } = tableFilterProps;

  return (
    <Flex flexDirection="column" gap={'2'} mx={'10'}>
      <Flex gap={'2'} alignItems={'center'}>
        <Icon icon={'filter_list'} />
        <Heading size={'sm'} as={'h4'} fontWeight={'normal'}>
          FILTER
        </Heading>
      </Flex>
      <Flex alignItems="center" gap={'4'} flexWrap={'wrap'}>
        <TableFilter
          filterOptions={filterOptions}
          filterName={'Status'}
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
