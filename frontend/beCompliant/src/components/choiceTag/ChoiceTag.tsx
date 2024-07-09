import { Flex, Tag } from '@kvib/react';
import colorUtils from '../../utils/colorUtils';
import { Choice } from '../../types/tableTypes';

interface ChoiceTagProps {
  choices: Choice[];
  cellValue: string[] | string | number;
  cellRenderValue: string | number;
}

interface ChoiceColors {
  backgroundColor: string;
  textColor: string;
}

function hasColorKey(obj: object): boolean {
  return 'color' in obj;
}

const getChoiceColors = (
  choices: Choice[],
  value: string | number
): ChoiceColors | undefined => {
  const choice = choices.find((choice) => choice.name === value.toString());
  const hasColor = choice !== undefined && hasColorKey(choice);
  if (hasColor) {
    const hexColor = colorUtils.getHexForColor(choice.color);
    const textColor = colorUtils.shouldUseLightTextOnColor(choice.color)
      ? '#FFFFFF'
      : '#000000';
    if (hexColor === null) return undefined;

    return { backgroundColor: hexColor, textColor: textColor };
  }
  return undefined;
};

export const ChoiceTag = (props: ChoiceTagProps) => {
  const { choices, cellValue } = props;

  if (Array.isArray(cellValue)) {
    return (
      <Flex flexWrap={'wrap'} gap={'1'}>
        {cellValue
          .sort((a, b) => a.length - b.length)
          .map((cell, index) => {
            const choiceColors = getChoiceColors(choices, cell);
            return (
              <Tag
                width="fit-content"
                key={index}
                backgroundColor={choiceColors?.backgroundColor}
                color={choiceColors?.textColor}
                variant={'solid'}
              >
                {cell}
              </Tag>
            );
          })}
      </Flex>
    );
  }

  const choiceColors = getChoiceColors(choices, cellValue);
  return (
    <Tag
      backgroundColor={choiceColors ? choiceColors.backgroundColor : ''}
      color={choiceColors ? choiceColors.textColor : ''}
    >
      {cellValue}
    </Tag>
  );
};
