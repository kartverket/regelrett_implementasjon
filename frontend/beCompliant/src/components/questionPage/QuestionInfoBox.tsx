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
  if (columnsError || !columns)
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;

  const getOptionalField = (key: string) =>
    question.metadata.optionalFields?.find((field) => field.key === key)
      ?.value[0];

  const getColumnColor = (key: string) =>
    columns
      ?.find((column) => column.name === key)
      ?.options?.find((option) => option.name === getOptionalField(key))?.color;

  const priority = getOptionalField('Pri');
  const leadTime = getOptionalField('Ledetid');
  const domain = getOptionalField('Område');

  const priorityColor = getColumnColor('Pri') || 'grayLight1';
  const backgroundColorHex = colorUtils.getHexForColor(priorityColor);
  const useWhiteTextColor = colorUtils.shouldUseLightTextOnColor(priorityColor);

  return (
    <Card backgroundColor="blue.50" maxWidth="350px" align="center">
      <CardBody flexDirection="row" display="flex" gap="10">
        <Stack flexDirection="column">
          <Text as="b">Prioritet</Text>
          <Text as="b">Ledetid</Text>
          <Text as="b">Område</Text>
        </Stack>
        <Stack flexDirection="column">
          <Tag
            backgroundColor={backgroundColorHex ?? 'white'}
            textColor={useWhiteTextColor ? 'white' : 'black'}
            maxWidth="50px"
            justifyContent="center"
          >
            {priority}
          </Tag>
          <Text>{leadTime}</Text>
          <Text>{domain}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}
