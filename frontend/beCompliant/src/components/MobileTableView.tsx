import { Button, Flex, Text, useTheme } from '@kvib/react';
import { useState } from 'react';
import { Choice, TableMetaData } from '../hooks/datafetcher';
import { RecordType } from '../pages/TablePage';
import MobileFilter from './MobileFilter';
import { Answer } from './answer/Answer';
import { TableFilterProps } from './tableActions/TableFilter';

interface Props {
  filteredData: RecordType[];
  choices: Choice[];
  team?: string;
  tableFilterProps: TableFilterProps;
  tableMetadata?: TableMetaData;
}

const MobileTableView = ({
  filteredData,
  choices,
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
                team={team}
                key={item.fields?.ID}
              />
            </div>
          </Flex>
        ))}
      </Flex>
    </>
  );
};

export default MobileTableView;
