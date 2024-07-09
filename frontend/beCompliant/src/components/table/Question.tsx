import { Box, Flex, Tag } from '@kvib/react';
import colorUtils from '../../utils/colorUtils';
import { Choice, Field } from '../../types/tableTypes';

type QuestionProps = {
  value: any;
  column: Field;
};

export const Question = ({ value, column }: QuestionProps) => {
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
  if (column.name === 'Svar') {
    // TODO add support for the Answer component
    return <Box>{value}</Box>;
  }

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
  return <Box>{value}</Box>;
};
