import { Text, Stack } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';
import { Question } from '../../api/types';

type Props = {
  question: Question;
  answerUpdated: string;
};

export function QuestionDetails({ question, answerUpdated }: Props) {
  const sikkerhetskontroller = question.metadata.optionalFields?.find(
    (field) => field.key == 'Sikkerhetskontroller'
  )?.value[0];

  return (
    <Stack marginBottom="120px" gap="4px">
      <Text fontSize="md">{question.id}</Text>
      <Text fontSize="lg" as="b">
        {sikkerhetskontroller}
      </Text>
      <Text fontSize="lg">
        {'Svar sist endret ' + formatDateTime(answerUpdated)}
      </Text>
    </Stack>
  );
}
