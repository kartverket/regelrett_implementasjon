import { Box, Tag } from '@kvib/react';
import { Row } from '@tanstack/react-table';
import { Choice, Field, RecordType } from '../../types/tableTypes';
import colorUtils from '../../utils/colorUtils';
import { AnswerCell } from './AnswerCell';

type QuestionProps = {
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
}: QuestionProps) => {
  if (answerable) {
    return (
      <AnswerCell
        value={value}
        answerType={column.type}
        questionId={row.original.fields.ID}
        questionName={row.original.fields.Aktivitet}
        comment={row.original.fields.comment ?? ''}
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
  return <Box>{value}</Box>;
};
