import {
  Center,
  Flex,
  Heading,
  Spinner,
  Tag,
  TagCloseButton,
  TagLabel,
  useMediaQuery,
} from '@kvib/react';
import { useEffect, useState } from 'react';
import { AnswerType } from '../components/answer/Answer';
import { useAnswersFetcher } from '../hooks/answersFetcher';
import { Option, useMetodeverkFetcher } from '../hooks/datafetcher';
import { sortData } from '../utils/sorter';

import { TableActions } from '../components/tableActions/TableActions';

import { useParams } from 'react-router-dom';
import MobileTableView from '../components/MobileTableView';
import { TableComponent } from '../components/Table';
import { TableStatistics } from '../components/tableStatistics/TableStatistics';
import { useCommentsFetcher } from '../hooks/commentsFetcher';

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

export type HiddenColumn = {
  name: string;
  index: number;
};

export const MainTableComponent = () => {
  const params = useParams();
  const team = params.teamName;
  const { answers, loading: answersLoading } = useAnswersFetcher(team);
  const {
    data,
    dataError,
    choices,
    tableMetaData,
    loading: metodeverkLoading,
  } = useMetodeverkFetcher(team);

  const [hiddenColumns, setHiddenColumns] = useState<HiddenColumn[]>([]);

  const { comments } = useCommentsFetcher(team);
  const [fieldSortedBy, setFieldSortedBy] = useState<keyof Fields>(
    '' as keyof Fields
  );

  const [combinedData, setCombinedData] = useState<RecordType[]>([]);
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
  const [activeFilters, setActiveFilters] = useState<ActiveFilter[]>([]);
  const [filteredData, setFilteredData] = useState<RecordType[]>([]);

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)');

  const updateToCombinedData = (
    answers: AnswerType[],
    data: RecordType[]
  ): RecordType[] => {
    return data.map((item: RecordType) => {
      const answersMatch = answers?.find(
        (answer: AnswerType) => answer.questionId === item.fields.ID
      );
      const commentsMatch = comments?.find(
        (comment: any) => comment.questionId === item.fields.ID
      );
      const combinedData = {
        ...item,
        fields: {
          ...item.fields,
          ...answersMatch,
          ...commentsMatch,
          Status: answersMatch?.Svar ? 'Utfylt' : 'Ikke utfylt',
        },
      };
      return combinedData;
    });
  };

  useEffect(() => {
    const updatedData = updateToCombinedData(answers!, data);
    setCombinedData(updatedData);
  }, [answers, data]);

  useEffect(() => {
    const sortedData = sortData(combinedData ?? [], fieldSortedBy);
    setCombinedData(sortedData);
  }, [fieldSortedBy]);

  const filterData = (
    data: RecordType[],
    filters: ActiveFilter[]
  ): RecordType[] => {
    if (!filters.length || !data.length) return data;

    return filters.reduce((filteredData, filter) => {
      const fieldName = filter.filterName as keyof Fields;

      if (!fieldName || !(fieldName in data[0].fields)) {
        console.error(`Invalid filter field name: ${filter.filterName}`);
        return filteredData;
      }

      return filteredData.filter((record: RecordType) => {
        const recordField = record.fields[fieldName];
        if (typeof recordField === 'string')
          return recordField === filter.filterValue;
        if (typeof recordField === 'number')
          return recordField.toString() === filter.filterValue;
        if (Array.isArray(recordField))
          return recordField.includes(filter.filterValue);
        return false;
      });
    }, data);
  };

  useEffect(() => {
    const filteredData = filterData(combinedData, activeFilters);
    setFilteredData(filteredData);
  }, [activeFilters, combinedData, fieldSortedBy]);

  if ((!answers && answersLoading) || metodeverkLoading) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

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

  if (isLargerThan800) {
    return (
      <>
        {dataError ? (
          <div>{dataError}</div> // Display error if there is any
        ) : filteredData && tableMetaData ? (
          <>
            <Heading style={{ margin: 20 }}>{team}</Heading>
            <TableStatistics filteredData={filteredData} />
            <TableActions
              tableFilterProps={tableFilterProps}
              tableMetadata={tableMetaData}
              tableSorterProps={tableSorterProps}
            />
            {hiddenColumns.length > 0 && (
              <Flex direction="column" gap="8px" margin="20px">
                <Heading size="xs">Skjulte kolonner</Heading>
                <Flex gap="4px">
                  {hiddenColumns.map((column) => (
                    <Tag>
                      <TagLabel>{column.name}</TagLabel>
                      <TagCloseButton
                        onClick={() =>
                          setHiddenColumns((prev) =>
                            prev.filter((col) => col.index !== column.index)
                          )
                        }
                      />
                    </Tag>
                  ))}
                </Flex>
              </Flex>
            )}
            <TableComponent
              data={filteredData}
              fields={tableMetaData.fields}
              team={team}
              choices={choices}
              hiddenColumns={hiddenColumns}
              setHiddenColumns={setHiddenColumns}
            />
          </>
        ) : (
          'No data to display...'
        )}
      </>
    );
  }

  return (
    <>
      <Heading style={{ margin: 20 }}>{team}</Heading>
      <TableStatistics filteredData={filteredData} />
      <MobileTableView
        filteredData={filteredData}
        choices={choices}
        team={team}
        tableFilterProps={tableFilterProps}
        tableMetadata={tableMetaData}
      />
    </>
  );
};
