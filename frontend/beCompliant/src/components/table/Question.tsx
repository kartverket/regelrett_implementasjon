import { Box, Tag } from '@kvib/react';
import { Field } from '../../hooks/datafetcher';
import colorUtils from '../../utils/colorUtils';

type QuestionProps = {
  value: any;
  column: Field;
};

export const Question = ({ value, column }: QuestionProps) => {
  const backgroundColor = column.options?.choices?.find(
    (choice) => choice.name === value
  )?.color;
  const backgroundColorHex = colorUtils.getHexForColor(
    backgroundColor ?? 'none'
  );
  const useWhiteTextColor = colorUtils.shouldUseLightTextOnColor(
    backgroundColor ?? 'none'
  );
  if (column.name === 'Svar') {
    // TODO add support for the Answer component
    return <Box>{value}</Box>;
  }

  switch (column.type) {
    case 'multipleSelects':
      return <Box>{Array.isArray(value) ? value.join(', ') : value}</Box>;
    case 'singleSelect':
      return (
        <Tag
          backgroundColor={backgroundColorHex ?? undefined}
          textColor={useWhiteTextColor ? 'white' : 'black'}
        >
          {value}
        </Tag>
      );
  }
  return <Box>{value}</Box>;
};
