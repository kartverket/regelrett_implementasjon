import { Box, Divider, Flex, Heading } from '@kvib/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/table/TableStatistics';
import { TableActions } from '../components/tableActions/TableActions';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchComments } from '../hooks/useFetchComments';
import { useFetchTable } from '../hooks/useFetchTable';
import { ActiveFilter } from '../types/tableTypes';
import { mapTableDataRecords } from '../utils/mapperUtil';
import { AnswerType, Column, OptionalFieldType } from '../api/types';
import { LoadingState } from '../components/LoadingState';
import { ErrorState } from '../components/ErrorState';
import { filterData } from '../utils/tablePageUtil';
import { useFetchContext } from '../hooks/useFetchContext';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useLocalstorageState } from '../hooks/useStorageState';
import { useCallback, useEffect, useRef } from 'react';

export const ActivityPage = () => {
  const params = useParams();
  const [search, setSearch] = useSearchParams();
  const filterSearchParams = search.get('filters');
  const contextId = params.contextId;

  const [activeFilters, setActiveFilters] = useLocalstorageState<
    Record<string, ActiveFilter[]>
  >('filters', {});

  const filterOverrideRef = useRef(false);

  const setFilters = useCallback(
    (newFilters: ActiveFilter[] | null) => {
      if (newFilters == null) {
        search.delete('filters');
      } else {
        search.set('filters', JSON.stringify(newFilters));
      }
      setSearch(search);
    },
    [search, setSearch]
  );

  const {
    data: context,
    error: contextError,
    isPending: contextIsPending,
  } = useFetchContext(contextId);

  const {
    data: userinfo,
    error: userinfoError,
    isPending: userinfoIsPending,
  } = useFetchUserinfo();

  const {
    data: tableData,
    error: tableError,
    isPending: tableIsPending,
  } = useFetchTable(context?.tableId);
  const {
    data: comments,
    error: commentError,
    isPending: commentIsPending,
  } = useFetchComments(contextId);
  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useFetchAnswers(contextId);

  useEffect(() => {
    if (!tableData?.id) return;

    if (!filterSearchParams) {
      if (activeFilters[tableData.id]?.length > 0) {
        setFilters(activeFilters[tableData.id]);
      }
    } else {
      const parsedFilters: ActiveFilter[] = JSON.parse(filterSearchParams);
      setActiveFilters((prev) => ({
        ...prev,
        [tableData.id]: parsedFilters,
      }));

      filterOverrideRef.current = true;
    }
  }, [filterSearchParams, tableData?.id, setFilters]);

  useEffect(() => {
    if (!tableData?.id) return;

    if (filterOverrideRef.current) {
      filterOverrideRef.current = false;
      return;
    }

    if (activeFilters[tableData.id]?.length > 0) {
      setFilters(activeFilters[tableData.id]);
    } else {
      setFilters(null);
    }
  }, [activeFilters, tableData?.id, setFilters]);

  useEffect(() => {
    return () => {
      search.delete('filters');
      setSearch(search);
    };
  }, []);

  const error =
    tableError || commentError || answerError || contextError || userinfoError;

  const isPending =
    tableIsPending ||
    commentIsPending ||
    answerIsPending ||
    contextIsPending ||
    userinfoIsPending;

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

  if (error) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  tableData.records = mapTableDataRecords(tableData, comments, answers);
  const filteredData = filterData(
    tableData.records,
    activeFilters[tableData.id] ?? []
  );
  const filters = {
    filterOptions: statusFilterOptions.options,
    filterName: '',
    activeFilters: activeFilters[tableData.id] ?? [],
    setActiveFilters: (activeFilters: ActiveFilter[]) =>
      setActiveFilters((prev) => ({ ...prev, [tableData.id]: activeFilters })),
  };

  const allSingleSelect = tableData.records.every(
    (record) =>
      record.metadata?.answerMetadata?.type === AnswerType.SELECT_SINGLE
  );

  return (
    <Page>
      <Flex flexDirection="column" marginX="10" gap="2">
        <Heading lineHeight="1.2">{`${context?.name} - ${tableData.name}`}</Heading>
        <TableStatistics filteredData={filteredData} />
      </Flex>
      <Box width="100%" paddingX="10">
        <Divider borderColor="gray.400" />
      </Box>
      <TableActions
        filters={filters}
        tableMetadata={tableData.columns}
        filterByAnswer={allSingleSelect}
      />
      <TableComponent
        contextId={context.id}
        data={filteredData}
        tableData={tableData}
        user={userinfo.user}
      />
    </Page>
  );
};
