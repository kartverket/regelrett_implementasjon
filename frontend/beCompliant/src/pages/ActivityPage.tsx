import { Box, Divider, Flex, Heading } from '@kvib/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/table/TableStatistics';
import { TableActions } from '../components/tableActions/TableActions';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchComments } from '../hooks/useFetchComments';
import { useFetchTable } from '../hooks/useFetchTable';
import { ActiveFilter } from '../types/tableTypes';
import { mapTableDataRecords } from '../utils/mapperUtil';
import { Column, OptionalFieldType } from '../api/types';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { filterData } from '../utils/tablePageUtil';

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
    data: comments,
    error: commentError,
    isPending: commentIsPending,
  } = useFetchComments(team ?? '');
  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useFetchAnswers(team);

  const error = tableError || commentError || answerError;
  const isPending = tableIsPending || commentIsPending || answerIsPending;

  const statusFilterOptions: Column = {
    options: [
      { name: 'Utfylt', color: '' },
      { name: 'Ikke utfylt', color: '' },
    ],
    name: 'Status',
    type: OptionalFieldType.OPTION_SINGLE,
  };

  if (isPending) {
    return <LoadingState />;
  }

  if (error || !tableData || !comments || !answers) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }
  tableData.records = mapTableDataRecords(tableData, comments, answers);
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

      <TableActions filters={filters} tableMetadata={tableData.columns} />
      <TableComponent data={filteredData} tableData={tableData} />
    </Page>
  );
};
