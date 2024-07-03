import {Box, Tag} from '@kvib/react';
import {Field} from '../../hooks/datafetcher';
import colorUtils from '../../utils/colorUtils';

type QuestionProps = {
    value: any;
    column: Field;
};

export const Question = ({value, column}: QuestionProps) => {
    if (value == null) {
        return <></>;
    }

    const backgroundColor = column.options?.choices?.find(
        (choice) => choice.name === value
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
        case 'multipleSelects':
            return <Box>{value}</Box>;
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
