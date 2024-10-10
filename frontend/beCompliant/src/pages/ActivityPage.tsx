import { Box, Divider, Flex, Heading } from '@kvib/react';
import { useEffect, useState } from 'react';
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
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useFetchTables } from '../hooks/useFetchTables';
import { TablePicker } from '../components/tableActions/TablePicker';
import { useFetchFriskFunction } from '../hooks/useFetchFriskFunction';

export const ActivityPage = () => {
  const params = useParams();
  const teamId = params.teamId;
  const functionId = params.functionId
    ? Number.parseInt(params.functionId)
    : undefined;

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [activeTableId, setActiveTableId] = useState<string>();

  const {
    data: tablesData,
    error: tablesError,
    isPending: tablesIsPending,
  } = useFetchTables();

  const {
    data: userinfo,
    error: userinfoError,
    isPending: userinfoIsPending,
  } = useFetchUserinfo();

  const {
    data: tableData,
    error: tableError,
    isPending: tableIsPending,
  } = useFetchTable(activeTableId);
  const {
    data: comments,
    error: commentError,
    isPending: commentIsPending,
  } = useFetchComments(teamId, functionId);
  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useFetchAnswers(teamId, functionId);
  const {
    data: func,
    error: funcError,
    isPending: funcIsPending,
  } = useFetchFriskFunction(functionId);

  useEffect(() => {
    if (tablesData && !activeTableId) {
      setActiveTableId(tablesData?.[0]?.id);
    }
  }, [tablesData, activeTableId]);

  const teamName = userinfo?.groups.find(
    (team) => team.id === teamId
  )?.displayName;

  const error =
    tableError ||
    commentError ||
    answerError ||
    userinfoError ||
    tablesError ||
    funcError;

  const functionName = func?.name;

  const isPending =
    tableIsPending ||
    commentIsPending ||
    answerIsPending ||
    userinfoIsPending ||
    tablesIsPending ||
    funcIsPending;

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
        <Heading lineHeight="1.2">{teamName ?? functionName}</Heading>
        <TableStatistics filteredData={filteredData} />
      </Flex>
      <Box width="100%" paddingX="10">
        <Divider borderColor="gray.400" />
      </Box>
      <TablePicker
        tables={tablesData}
        activeTableId={activeTableId}
        setActiveTableId={setActiveTableId}
      />
      <TableActions filters={filters} tableMetadata={tableData.columns} />
      <TableComponent data={filteredData} tableData={tableData} />
    </Page>
  );
};
