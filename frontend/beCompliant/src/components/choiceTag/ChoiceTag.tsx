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

const findChoice = (choices: Choice[], cellValue: string) => {
  return choices.find((choice) => choice.name === cellValue);
};

const getChoiceColors = (
  choices: Choice[],
  value: string | number
): ChoiceColors | undefined => {
  const choice = findChoice(choices, value.toString());
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
  const { choices, cellValue, cellRenderValue } = props;

  if (Array.isArray(cellValue)) {
    return (
      <Flex direction="column">
        {cellValue.map((item, index) => {
          const choiceColors = getChoiceColors(choices, cellValue[index]);
          return (
            <Tag
              key={index}
              width={'fit-content'}
              marginBottom={index < cellValue.length - 1 ? 5 : 0}
              backgroundColor={choiceColors ? choiceColors.backgroundColor : ''}
              color={choiceColors ? choiceColors.textColor : ''}
            >
              {cellValue[index]}
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
