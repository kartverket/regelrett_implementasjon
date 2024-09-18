import { Flex, Tag, Text } from '@kvib/react';
import { Row } from '@tanstack/react-table';
import { AnswerCell } from './AnswerCell';
import { Field, OptionalFieldType, Question } from '../../api/types';
import colorUtils from '../../utils/colorUtils';

type Props = {
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
}: Props) => {
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
        options={column.options}
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
      const backgroundColor = column.options?.find(
        (option) => option.name === value.value[0]
      )?.color;

      const backgroundColorHex = colorUtils.getHexForColor(
        backgroundColor ?? 'grayLight1'
      );
      const useWhiteTextColor = colorUtils.shouldUseLightTextOnColor(
        backgroundColor ?? 'grayLight1'
      );

      return (
        <Tag
          backgroundColor={backgroundColorHex ?? 'white'}
          textColor={useWhiteTextColor ? 'white' : 'black'}
        >
          {value.value}
        </Tag>
      );
  }
  return (
    <Text whiteSpace="normal" fontSize="md">
      {value.value}
    </Text>
  );
};
