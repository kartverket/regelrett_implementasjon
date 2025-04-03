import { Flex, Heading, Icon } from '@kvib/react';
import { Column } from '../../api/types';
import { TableFilter } from './TableFilter';
import { useStoredRedirect } from '../../hooks/useStoredRedirect';
import { Table as TanstackTable } from '@tanstack/react-table';

interface Props<TData> {
  tableMetadata: Column[];
  filterByAnswer: boolean;
  table: TanstackTable<TData>;
  formId: string;
}

export const TableActions = <TData,>({
  tableMetadata,
  filterByAnswer,
  table,
  formId,
}: Props<TData>) => {
  const storedRedirect = useStoredRedirect();

  const statusFilterKolonne = table.getColumn('Svar');

  return (
    <Flex
      flexDirection="column"
      gap="2"
      paddingX="10"
      py="5"
      position="sticky"
      top={storedRedirect ? '10' : '0'}
      zIndex="1000"
      backgroundColor="gray.50"
      w="100%"
    >
      <Flex gap="2" alignItems="center">
        <Icon icon="filter_list" />
        <Heading size="sm" as="h4" fontWeight="normal">
          FILTER
        </Heading>
      </Flex>
      <Flex alignItems="center" gap="4" flexWrap="wrap">
        {statusFilterKolonne && (
          <TableFilter
            filterOptions={[
              { name: 'Utfylt', value: 'utfylt' },
              { name: 'Ikke utfylt', value: 'ikke utfylt' },
            ]}
            filterName="Status"
            column={statusFilterKolonne}
            formId={formId}
          />
        )}

        {tableMetadata
          .filter(({ name }) => filterByAnswer || name !== 'Svar')
          .map((metaColumn) => {
            const column = table.getColumn(metaColumn.name);
            if (!column || !metaColumn.options) return null;
            return (
              <TableFilter
                key={metaColumn.name}
                filterName={metaColumn.name}
                filterOptions={metaColumn.options.map((option) => {
                  return { name: option.name, value: option.name };
                })}
                column={column}
                formId={formId}
              />
            );
          })}
      </Flex>
    </Flex>
  );
};
