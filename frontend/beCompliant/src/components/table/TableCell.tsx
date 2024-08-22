import { Flex, Tag, Text } from '@kvib/react';
import { Row } from '@tanstack/react-table';
import colorUtils from '../../utils/colorUtils';
import { AnswerCell } from './AnswerCell';
import { Field, Question } from '../../api/types';

type TableCellProps = {
  value: any;
  column: Field;
  row: Row<Question>;
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
        value={row.original.answers[0]?.answer}
        answerType={row.original.metadata?.answerMetadata.type}
        questionId={row.original.id}
        questionName={row.original.question}
        comment={row.original.comments?.at(0)?.comment ?? ''}
        choices={row.original.metadata?.answerMetadata.options}
      />
    );
  }

  if (value == null) {
    return <></>;
  }

  switch (value.type) {
    case 'OPTION_MULTIPLE': {
      const valueArray = value.value;
      return (
        <Flex flexWrap={'wrap'} gap={'1'}>
          {valueArray
            .sort((a: string, b: string) => a.length - b.length)
            .map((text: string, index: number) => {
              return (
                <Tag key={index} variant="solid">
                  {text}
                </Tag>
              );
            })}
        </Flex>
      );
    }
    case 'OPTION_SINGLE':
      return (
        <Tag colorScheme={undefined} backgroundColor={'#cccccc'}>
          {value.value}
        </Tag>
      );
  }
  return (
    <Text whiteSpace="normal" fontSize={'md'}>
      {value.value}
    </Text>
  );
};
