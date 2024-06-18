import { Button, Flex, Text, useTheme } from '@kvib/react';
import { RecordType } from '../pages/Table';
import { Answer } from './answer/Answer';
import { Dispatch, SetStateAction, useState } from 'react';
import MobileFilter from './MobileFilter';
import { TableMetaData } from '../hooks/datafetcher';
import { TableFilterProps } from './tableActions/TableFilter';

interface Props {
  filteredData: RecordType[];
  choices: string[];
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  team?: string;
  tableFilterProps: TableFilterProps;
  tableMetadata?: TableMetaData;
}

const MobileTableView = ({
  filteredData,
  choices,
  setFetchNewAnswers,
  team,
  tableFilterProps,
  tableMetadata,
}: Props) => {
  const theme = useTheme();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const numberOfItems = filteredData.length;

  return (
    <>
      {tableMetadata && (
        <MobileFilter
          tableFilterProps={tableFilterProps}
          tableMetadata={tableMetadata}
          isOpen={isDrawerOpen}
          setIsOpen={setIsDrawerOpen}
          numberOfItems={numberOfItems}
        />
      )}
      <Flex direction="column">
        <Flex
          style={{
            marginBottom: '18px',
            marginRight: '14px',
            marginLeft: '14px',
          }}
        >
          <Text as="b" style={{ marginRight: 'auto' }}>
            {numberOfItems} aktiviteter
          </Text>
          <Button
            leftIcon="filter_list"
            variant="tertiary"
            style={{ height: 'fit-content' }}
            onClick={() => setIsDrawerOpen(true)}
          >
            Filtrér
          </Button>
        </Flex>
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
            <Text>{item.fields.Aktivitet}</Text>
            <Flex gap="41px">
              <Text as="b">{item.fields.Pri}</Text>
              <Text as="b">{item.fields.Status}</Text>
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
    </>
  );
};

export default MobileTableView;
