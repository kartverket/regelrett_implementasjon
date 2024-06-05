import { Flex, Text, useTheme } from '@kvib/react';
import { RecordType } from '../pages/Table';
import { Answer } from './answer/Answer';
import { Dispatch, SetStateAction } from 'react';

interface Props {
  filteredData: RecordType[];
  choices: string[];
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  team?: string;
}

const MobileTableView = ({
  filteredData,
  choices,
  setFetchNewAnswers,
  team,
}: Props) => {
  const theme = useTheme();

  return (
    <Flex direction="column">
      {filteredData.map((item: RecordType, index: number) => (
        <Flex
          style={{
            minHeight: '158px',
            backgroundColor:
              index % 2 === 0 ? theme.colors.green[100] : 'white',
            padding: '19px',
          }}
          direction="column"
          gap="8px"
        >
          <Text>{item.fields.Aktivitiet}</Text>
          <Flex gap="41px">
            <Text as="b">{item.fields.Pri}</Text>
            <Text as="b">{item.fields.status}</Text>
            {item.fields.Hvem && (
              <Text as="b">{item.fields.Hvem.join(', ')}</Text>
            )}
          </Flex>
          <div style={{ maxWidth: '180px' }}>
            <Answer
              choices={choices}
              answer={item.fields.Svar ? item.fields.Svar : ''}
              record={item}
              setFetchNewAnswers={setFetchNewAnswers}
              team={team}
            />
          </div>
        </Flex>
      ))}
    </Flex>
  );
};

export default MobileTableView;
