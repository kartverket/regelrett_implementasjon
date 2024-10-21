import { Box, Divider, Flex, Heading } from '@kvib/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
import { useFetchTables } from '../hooks/useFetchTables';
import { useFetchContext } from '../hooks/useFetchContext';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';

export const ActivityPage = () => {
  const params = useParams();
  const contextId = params.contextId;
  const activeTableId = params.tableId;

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const navigate = useNavigate();

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
  } = useFetchComments(activeTableId, contextId);
  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useFetchAnswers(activeTableId, contextId);
  const {
    data: context,
    error: contextError,
    isPending: contextIsPending,
  } = useFetchContext(contextId);

  const error =
    tableError || commentError || answerError || tablesError || contextError || userinfoError;

  const isPending =
    tableIsPending ||
    commentIsPending ||
    answerIsPending ||
    tablesIsPending ||
    contextIsPending ||
    userinfoIsPending;

  useEffect(() => {
    if (!activeTableId && contextId && tablesData) {
      navigate(`/context/${contextId}/${tablesData[0].id}`);
    }
  }, [activeTableId, contextId, tablesData, navigate]);

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
        <Heading lineHeight="1.2">{context?.name}</Heading>
        <TableStatistics filteredData={filteredData} />
      </Flex>
      <Box width="100%" paddingX="10">
        <Divider borderColor="gray.400" />
      </Box>
      <TableActions filters={filters} tableMetadata={tableData.columns} />
      <TableComponent
        contextId={context.id}
        data={filteredData}
        tableData={tableData}
        user={userinfo.user}
      />
    </Page>
  );
};
