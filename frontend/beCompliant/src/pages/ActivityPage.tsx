import { useParams } from 'react-router-dom';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchMetodeverk } from '../hooks/useFetchMetodeverk';
import { useFetchComments } from '../hooks/useFetchComments';
import { Center, Flex, Heading, Icon, Spinner } from '@kvib/react';
import { filterData, updateToCombinedData } from '../utils/tablePageUtil';
import { useState } from 'react';
import { ActiveFilter, Option } from '../types/tableTypes';
import { TableActions } from '../components/tableActions/TableActions';
import { TableStatistics } from '../components/table/TableStatistics';
import { Page } from '../components/layout/Page';
import { TableComponent } from '../components/Table';

export const ActivityPage = () => {
  const params = useParams();
  const team = params.teamName;

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);

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

  const filters = {
    filterOptions: statusFilterOptions,
    filterName: '',
    activeFilters: activeFilters,
    setActiveFilters: setActiveFilters,
  };

  return (
    <Page>
      <Flex
        justifyContent="space-between"
        alignItems="center"
        w="100%"
        maxW="85ch"
      >
        <Heading>{team}</Heading>
        <TableStatistics filteredData={filteredData} />
      </Flex>
      <TableActions filters={filters} tableMetadata={tableMetaData} />
      <TableComponent data={filteredData} fields={tableMetaData.fields} />
    </Page>
  );
};
