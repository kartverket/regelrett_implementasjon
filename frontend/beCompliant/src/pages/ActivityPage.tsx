import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  useDisclosure,
} from '@kvib/react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/table/TableStatistics';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchComments } from '../hooks/useFetchComments';
import { useFetchForm } from '../hooks/useFetchForm';
import { ActiveFilter } from '../types/tableTypes';
import { mapTableDataRecords } from '../utils/mapperUtil';
import { AnswerType, Column, OptionalFieldType } from '../api/types';
import { ErrorState } from '../components/ErrorState';
import { filterData } from '../utils/tablePageUtil';
import { useFetchContext } from '../hooks/useFetchContext';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useLocalstorageState } from '../hooks/useStorageState';
import { useCallback, useEffect, useRef } from 'react';
import { SettingsModal } from '../components/table/SettingsModal';

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
  } = useFetchForm(context?.formId);
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

  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();

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

  const statusFilterOptions: Column = {
    options: [
      { name: 'Utfylt', color: '' },
      { name: 'Ikke utfylt', color: '' },
    ],
    name: 'Status',
    type: OptionalFieldType.OPTION_SINGLE,
  };

  if (error) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  if (tableData && comments && answers) {
    tableData.records = mapTableDataRecords(tableData, comments, answers);
  }
  const filteredData = tableData
    ? filterData(tableData.records, activeFilters[tableData.id] ?? [])
    : [];
  const filters = {
    filterOptions: statusFilterOptions.options,
    filterName: '',
    activeFilters: tableData ? (activeFilters[tableData.id] ?? []) : [],
    setActiveFilters: (activeFilters: ActiveFilter[]) =>
      tableData &&
      setActiveFilters((prev) => ({ ...prev, [tableData.id]: activeFilters })),
  };

  const allSingleSelect = tableData?.records.every(
    (record) =>
      record.metadata?.answerMetadata?.type === AnswerType.SELECT_SINGLE
  );

  return (
    <Page>
      <Flex flexDirection="column" marginX="10" gap="2">
        <Skeleton isLoaded={!contextIsPending && !tableIsPending} fitContent>
          <Flex>
            <Heading lineHeight="1.2">{`${context?.name} - ${tableData?.name}`}</Heading>
            <IconButton
              variant="ghost"
              icon="settings"
              size="lg"
              aria-label="Edit context"
              colorScheme="blue"
              onClick={() => onSettingsOpen()}
            />
          </Flex>
        </Skeleton>
        <Skeleton
          isLoaded={!tableIsPending && !answerIsPending && !commentIsPending}
          fitContent
        >
          <TableStatistics filteredData={filteredData} />
        </Skeleton>
      </Flex>
      <Box width="100%" paddingX="10">
        <Divider borderColor="gray.400" />
      </Box>
      <Box
        minH="100vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <Skeleton
          isLoaded={
            !tableIsPending &&
            !userinfoIsPending &&
            !contextIsPending &&
            !answerIsPending &&
            !commentIsPending
          }
          minH="100vh"
          minW="60vw"
          w="auto"
        >
          {!!tableData &&
            !!context &&
            !!userinfo &&
            !!comments &&
            !!answers && (
              <TableComponent
                filters={filters}
                tableMetadata={tableData?.columns ?? []}
                filterByAnswer={allSingleSelect ?? false}
                contextId={context?.id}
                data={filteredData}
                tableData={tableData}
                user={userinfo.user}
              />
            )}
        </Skeleton>
      </Box>
      <SettingsModal
        onOpen={onSettingsOpen}
        onClose={onSettingsClose}
        isOpen={isSettingsOpen}
      />
    </Page>
  );
};
