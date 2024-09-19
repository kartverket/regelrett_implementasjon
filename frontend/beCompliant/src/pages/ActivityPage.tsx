import { useParams } from 'react-router-dom';
import {
  Box,
  Center,
  Divider,
  Flex,
  Heading,
  Icon,
  Spinner,
} from '@kvib/react';
import { filterData } from '../utils/tablePageUtil';
import { useState } from 'react';
import { ActiveFilter } from '../types/tableTypes';
import { TableActions } from '../components/tableActions/TableActions';
import { TableStatistics } from '../components/table/TableStatistics';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';
import { useFetchTable } from '../hooks/useFetchTable';
import { Field, OptionalFieldType } from '../api/types';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchComments } from '../hooks/useFetchComments';
import { mapTableDataRecords } from '../utils/mapperUtil';

export const ActivityPage = () => {
  const params = useParams();
  const team = params.teamName;
  const tableId = '570e9285-3228-4396-b82b-e9752e23cd73';

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

  const {
    data: tableData,
    error: tableError,
    isPending: tableIsPending,
  } = useFetchTable(tableId, team);
  const {
    data: commentData,
    error: commentError,
    isPending: commentIsPending,
  } = useFetchComments(team ?? '');
  const {
    data: answerData,
    error: answerError,
    isPending: answerIsPending,
  } = useFetchAnswers(team);

  const error = tableError || commentError || answerError;
  const isPending = tableIsPending || commentIsPending || answerIsPending;

  const statusFilterOptions: Field = {
    options: [
      { name: 'Utfylt', color: '' },
      { name: 'Ikke utfylt', color: '' },
    ],
    name: 'Status',
    type: OptionalFieldType.OPTION_SINGLE,
  };

  if (isPending) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !tableData || !commentData || !answerData) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size={'md'}>Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  tableData.records = mapTableDataRecords(tableData, commentData, answerData);

  const filteredData = filterData(tableData.records, activeFilters);
  const filters = {
    filterOptions: statusFilterOptions.options,
    filterName: '',
    activeFilters: activeFilters,
    setActiveFilters: setActiveFilters,
  };

  return (
    <Page>
      <Flex flexDirection="column" marginX="10" gap="2">
        <Heading lineHeight="1.2">{team}</Heading>
        <TableStatistics filteredData={filteredData} />
      </Flex>
      <Box width="100%" paddingX="10">
        <Divider borderColor="gray.400" />
      </Box>

      <TableActions filters={filters} tableMetadata={tableData.fields} />
      <TableComponent data={filteredData} tableData={tableData} />
    </Page>
  );
};
