import { Flex, Tag, Text } from '@kvib/react';
import { Row } from '@tanstack/react-table';
import { AnswerCell } from './AnswerCell';
import { Field, OptionalFieldType, Question } from '../../api/types';

type Props = {
  value: any;
  column: Field;
  row: Row<Question>;
  answerable?: boolean;
};

export const TableCell = ({ value, row, answerable = false }: Props) => {
  if (answerable) {
    return (
      <AnswerCell
        value={row.original.answers.at(-1)?.answer}
        answerType={row.original.metadata?.answerMetadata.type}
        questionId={row.original.id}
        questionName={row.original.question}
        comment={row.original.comments?.at(0)?.comment ?? ''}
        updated={row.original.answers[0]?.updated}
        choices={row.original.metadata?.answerMetadata.options}
      />
    );
  }

  if (value == null) {
    return <></>;
  }

  switch (value.type) {
    case OptionalFieldType.OPTION_MULTIPLE: {
      const valueArray = value.value;
      return (
        <Flex flexWrap="wrap" gap="1">
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
    case OptionalFieldType.OPTION_SINGLE:
      return <Tag backgroundColor={'#cccccc'}>{value.value}</Tag>;
  }
  return (
    <Text whiteSpace="normal" fontSize="md">
      {value.value}
    </Text>
  );
};
