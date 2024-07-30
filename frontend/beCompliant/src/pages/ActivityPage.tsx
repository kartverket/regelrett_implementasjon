import { useParams } from 'react-router-dom';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchMetodeverk } from '../hooks/useFetchMetodeverk';
import { useFetchComments } from '../hooks/useFetchComments';
import { Button, Center, Flex, Heading, Icon, Spinner } from '@kvib/react';
import { sortData } from '../utils/sorter';
import { filterData, updateToCombinedData } from '../utils/tablePageUtil';
import { useState } from 'react';
import { ActiveFilter, Fields, Option } from '../types/tableTypes';
import { Actions } from '../components/tableActions/TableActions';
import { TableStatistics } from '../components/table/TableStatistics';
import { TableView } from '../components/TableView';
import { CardListView } from '../components/CardListView';

export const ActivityPage = () => {
  const params = useParams();
  const team = params.teamName;

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>(
    '' as keyof Fields
  );
  const [showAsTable, setShowAsTable] = useState(false);

  const {
    data: metodeverkData,
    isPending: isMetodeverkLoading,
    isError: isMetodeverkError,
  } = useFetchMetodeverk();

  const {
    data: answers,
    isPending: isAnswersLoading,
    isError: isAnswersError,
  } = useFetchAnswers(team);

  const { data: comments } = useFetchComments(team);
  const statusFilterOptions: Option = {
    choices: [
      { name: 'Utfylt', id: '', color: '' },
      {
        name: 'Ikke utfylt',
        id: '',
        color: '',
      },
    ],
    inverseLinkFieldId: '',
    isReversed: false,
    linkedTableId: '',
    prefersSingleRecordLink: false,
  };

  if (isAnswersLoading || isMetodeverkLoading) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (isMetodeverkError || isAnswersError) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size={'md'}>Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  const { records, tableMetaData, choices } = metodeverkData;
  const updatedData = updateToCombinedData(answers, records, comments);
  const filteredData = filterData(updatedData, activeFilters);
  const sortedData = sortData(filteredData, fieldSortedBy);

  const filters = {
    filterOptions: statusFilterOptions,
    filterName: '',
    activeFilters: activeFilters,
    setActiveFilters: setActiveFilters,
  };

  const sortedBy = {
    fieldSortedBy: fieldSortedBy,
    setFieldSortedBy: setFieldSortedBy,
  };

  return (
    <>
      <Flex
        direction="column"
        gap="32px"
        justifyContent="center"
        alignItems="center"
      >
        <Flex width="85ch" direction="column">
          <Heading>{team}</Heading>
          <TableStatistics filteredData={filteredData} />
          <Actions
            filters={filters}
            tableMetadata={tableMetaData}
            sortedBy={sortedBy}
          />
          <Button
            variant="tertiary"
            onClick={() => setShowAsTable((prev) => !prev)}
            width="fit-content"
            leftIcon={showAsTable ? 'list' : 'table'}
          >
            {showAsTable ? 'List view' : 'Table view'}
          </Button>
        </Flex>
        {showAsTable ? (
          <TableView data={sortedData} metadata={tableMetaData} />
        ) : (
          <CardListView data={sortedData} choices={choices} team={team} />
        )}
      </Flex>
    </>
  );
};
