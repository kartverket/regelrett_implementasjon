import { Flex, Tag, Text } from '@kvib/react';
import { Row } from '@tanstack/react-table';
import { Choice, Field, RecordType } from '../../types/tableTypes';
import colorUtils from '../../utils/colorUtils';
import { AnswerCell } from './AnswerCell';

type TableCellProps = {
  value: any;
  column: Field;
  row: Row<RecordType>;
  answerable?: boolean;
};

export const TableCell = ({
  value,
  column,
  row,
  answerable = false,
}: TableCellProps) => {
  if (answerable) {
    return (
      <AnswerCell
        value={value}
        answerType={column.type}
        questionId={row.original.fields.ID}
        questionName={row.original.fields.Sikkerhetskontroller}
        choices={column.options?.choices}
      />
    );
  }

  if (value == null) {
    return <></>;
  }
  const backgroundColor = column.options?.choices?.find(
    (choice: Choice) => choice.name === value
  )?.color;
  const backgroundColorHex = colorUtils.getHexForColor(
    backgroundColor ?? 'grayLight1'
  );
  const useWhiteTextColor = colorUtils.shouldUseLightTextOnColor(
    backgroundColor ?? 'grayLight1'
  );

  switch (column.type) {
    case 'multipleSelects': {
      const valueArray = value.split(',');
      return (
        <Flex flexWrap={'wrap'} gap={'1'}>
          {valueArray
            .sort((a: string, b: string) => a.length - b.length)
            .map((value: string, index: number) => {
              return (
                <Tag key={index} variant="solid">
                  {value}
                </Tag>
              );
            })}
        </Flex>
      );
    }
    case 'singleSelect':
      return (
        <Tag
          colorScheme={undefined}
          backgroundColor={backgroundColorHex ?? 'white'}
          textColor={useWhiteTextColor ? 'white' : 'black'}
        >
          {value}
        </Tag>
      );
  }
  return (
    <Text whiteSpace="normal" fontSize={'md'}>
      {value}
    </Text>
  );
};
