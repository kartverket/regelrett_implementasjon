import { Center, Heading, Icon, Spinner, useMediaQuery } from '@kvib/react';
import { useEffect, useState } from 'react';
import { sortData } from '../utils/sorter';

import { TableActions } from '../components/tableActions/TableActions';

import { useParams } from 'react-router-dom';
import MobileTableView from '../components/MobileTableView';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/tableStatistics/TableStatistics';
import { useFetchAnswers } from '../hooks/useFetchAnswers';
import { useFetchComments } from '../hooks/useFetchComments';
import { useFetchMetodeverk } from '../hooks/useFetchMetodeverk';
import { filterData, updateToCombinedData } from '../utils/tablePageUtil';
import { Option } from '../hooks/datafetcher';

export type Fields = {
  Kortnavn: string;
  Pri: string;
  Løpenummer: number;
  Ledetid: string;
  Aktivitet: string;
  Område: string;
  Hvem: string[];
  Kode: string;
  ID: string;
  question: string;
  updated: string;
  Svar: string;
  actor: string;
  Status: string;
  comment: string;
};

export type RecordType = Record<string, Fields>;

export type ActiveFilter = {
  filterName: string;
  filterValue: string;
};

export const MainTableComponent = () => {
  const params = useParams();
  const team = params.teamName;

  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>('' as keyof Fields);


  const { data: metodeverkData, isPending: isMetodeverkLoading, isError: isMetodeverkError } = useFetchMetodeverk();

  const { data: answers, isPending: isAnswersLoading, isError: isAnswersError } = useFetchAnswers(team);

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


  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  useEffect(() => {
    console.log('MetodeverkComponent mounted');
    return () => {
      console.log('MetodeverkComponent unmounted');
    };
  }, []);


  if (isAnswersLoading || isMetodeverkLoading) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size='xl' />
      </Center>
    );
  }

  if (isMetodeverkError || isAnswersError) {
    return (
      <Center height='70svh' flexDirection='column' gap='4'>
        <Icon icon='error' size={64} weight={600} />
        <Heading size={'md'}>Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  const { records, tableMetaData, choices } = metodeverkData;

  const updatedData = updateToCombinedData(answers, records, comments);

  const filteredData = filterData(updatedData, activeFilters);
  const sortedData = sortData(filteredData, fieldSortedBy);


  const tableFilterProps = {
    filterOptions: statusFilterOptions,
    filterName: '',
    activeFilters: activeFilters,
    setActiveFilters: setActiveFilters,
  };

  const tableSorterProps = {
    fieldSortedBy: fieldSortedBy,
    setFieldSortedBy: setFieldSortedBy,
  };


  if (filteredData.length === 0) {
    return (
      <Heading size={'md'} m={8}>
        {'No data to display...'}
      </Heading>
    );
  }

  if (isLargerThan800) {
    return (
      <>
        <Heading style={{ margin: 20 }}>{team}</Heading>
        <TableStatistics filteredData={filteredData} />
        <TableActions
          tableFilterProps={tableFilterProps}
          tableMetadata={tableMetaData}
          tableSorterProps={tableSorterProps}
        />
        <TableComponent
          data={sortedData}
          fields={tableMetaData.fields}
          team={team}
          choices={choices}
        />
      </>
    );
  }

  return (
    <>
      <Heading style={{ margin: 20 }}>{team}</Heading>
      <TableStatistics filteredData={filteredData} />
      <MobileTableView
        filteredData={sortedData}
        choices={choices}
        team={team}
        tableFilterProps={tableFilterProps}
        tableMetadata={tableMetaData}
      />
    </>
  );
};
