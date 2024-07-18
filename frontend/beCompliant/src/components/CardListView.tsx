import { Flex } from '@kvib/react';
import { ActivityCard } from './ActivityCard';
import { CardListSearch } from './table/CardListSearch';
import { useState } from 'react';
import { Choice, RecordType } from '../types/tableTypes';
import { performSearch } from '../utils/tablePageUtil';

type Props = {
  data: RecordType[];
  choices: Choice[];
  team?: string;
};

export const CardListView = ({ data, choices, team }: Props) => {
  const [searchValue, setSearchValue] = useState('');
  const searchedData = performSearch(data, searchValue);

  return (
    <Flex width="85ch" direction="column">
      <CardListSearch value={searchValue} setValue={setSearchValue} />
      <Flex direction="column" width="85ch" gap="16px" marginTop="32px">
        {searchedData.map((record) => (
          <ActivityCard record={record} choices={choices} team={team} />
        ))}
      </Flex>
    </Flex>
  );
};
