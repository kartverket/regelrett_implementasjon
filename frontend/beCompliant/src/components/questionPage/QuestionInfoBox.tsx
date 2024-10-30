import { Text, Tag, Stack, Card, CardBody } from '@kvib/react';
import { Question } from '../../api/types';
import { useFetchColumns } from '../../hooks/useFetchColumns';
import colorUtils from '../../utils/colorUtils';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';

type Props = {
  question: Question;
  tableId: string;
};

export function QuestionInfoBox({ question, tableId }: Props) {
  const {
    data: columns,
    error: columnsError,
    isPending: columnsIsLoading,
  } = useFetchColumns(tableId);

  if (columnsIsLoading) return <LoadingState />;
  if (columnsError)
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;

  const getOptionalField = (key: string) =>
    question.metadata.optionalFields?.find((field) => field.key === key)
      ?.value[0];

  const getColumnColor = (key: string) =>
    columns
      .find((column) => column.name === key)
      ?.options?.find((option) => option.name === getOptionalField(key))?.color;

  return (
    <Card backgroundColor="blue.50" width="fit-content" height="fit-content">
      <CardBody flexDirection="row" display="flex" gap="10" alignItems="center">
        <Stack flexDirection="column">
          {question.metadata.optionalFields?.slice(3).map((field) => (
            <Text as="b" key={field.key}>
              {field.key}
            </Text>
          ))}
        </Stack>
        <Stack flexDirection="column">
          {question.metadata.optionalFields?.slice(3).map((field, index) => {
            const fieldValue = getOptionalField(field.key);
            const fieldColor = getColumnColor(field.key) || 'grayLight1';
            const fieldBackgroundColorHex =
              colorUtils.getHexForColor(fieldColor);
            const fieldUseWhiteTextColor =
              colorUtils.shouldUseLightTextOnColor(fieldColor);

            return fieldValue ? (
              <Tag
                key={index}
                backgroundColor={fieldBackgroundColorHex ?? 'white'}
                textColor={fieldUseWhiteTextColor ? 'white' : 'black'}
                width="fit-content"
                justifyContent="center"
              >
                {fieldValue}
              </Tag>
            ) : (
              <Tag
                key={index}
                backgroundColor={fieldBackgroundColorHex ?? 'white'}
                textColor={fieldUseWhiteTextColor ? 'white' : 'black'}
                width="fit-content"
                justifyContent="center"
              >
                Ikke oppgitt
              </Tag>
            );
          })}
        </Stack>
      </CardBody>
    </Card>
  );
}
