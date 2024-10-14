import { Text, Stack, StackProps } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';
import { Question } from '../../api/types';

type Props = StackProps & {
  question: Question;
  answerUpdated: Date;
};

export function QuestionDetails({ question, answerUpdated, ...rest }: Props) {
  const findFieldValue = (key: string) =>
    question.metadata.optionalFields?.find((field) => field.key === key)
      ?.value[0];

  const description =
    findFieldValue('Sikkerhetskontroller') || findFieldValue('Beskrivelse');

  return (
    <Stack gap="1" {...rest}>
      <Text>{question.id}</Text>
      <Text fontSize="lg" as="b">
        {description}
      </Text>
      <Text fontSize="lg">
        {'Svar sist endret ' + formatDateTime(answerUpdated)}
      </Text>
    </Stack>
  );
}
