import {
  Box,
  Divider,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Text,
  useDisclosure,
} from '@kvib/react';
import { useParams, useSearchParams } from 'react-router';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/table/TableStatistics';
import { useAnswers } from '../hooks/useAnswers';
import { useComments } from '../hooks/useComments';
import { useFetchForm } from '../hooks/useFetchForm';
import { ActiveFilter } from '../types/tableTypes';
import { mapTableDataRecords } from '../utils/mapperUtil';
import { AnswerType, Column, OptionalFieldType } from '../api/types';
import { ErrorState } from '../components/ErrorState';
import { filterData } from '../utils/tablePageUtil';
import { useContext } from '../hooks/useContext';
import { useUser } from '../hooks/useUser';
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
  } = useContext(contextId);

  const {
    data: userinfo,
    error: userinfoError,
    isPending: userinfoIsPending,
  } = useUser();

  const {
    data: tableData,
    error: tableError,
    isPending: tableIsPending,
  } = useFetchForm(context?.formId);
  const {
    data: comments,
    error: commentError,
    isPending: commentIsPending,
  } = useComments(contextId);
  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useAnswers(contextId);

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

  if (contextError) {
    const statusCode = contextError.response?.status;
    if (statusCode === 401) {
      return (
        <ErrorState message="Du har ikke tilgang til denne skjemautfyllingen" />
      );
    } else if (statusCode === 404) {
      return (
        <ErrorState message="Denne skjemautfyllingen finnes ikke. Kanskje den er slettet?" />
      );
    }
  } else if (error) {
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

  const teamName = userinfo?.groups.find(
    (team) => team.id === context?.teamId
  )?.displayName;

  return (
    <Page>
      <Flex flexDirection="column" maxW="100%" alignSelf="center" gap="8">
        <Flex flexDirection="column" gap="2" px="10">
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
            isLoaded={!contextIsPending && !userinfoIsPending}
            fitContent
          >
            <Text fontSize="xl" fontWeight="600" pb="7">
              Team: {teamName}{' '}
            </Text>
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
        <SettingsModal
          onOpen={onSettingsOpen}
          onClose={onSettingsClose}
          isOpen={isSettingsOpen}
          currentTeamName={teamName}
        />
      </Flex>
    </Page>
  );
};
