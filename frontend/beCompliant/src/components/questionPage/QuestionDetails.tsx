import { Text, Stack, StackProps } from '@kvib/react';
import { formatDateTime } from '../../utils/formatTime';
import { Question } from '../../api/types';

type Props = StackProps & {
  question: Question;
  answerUpdated: Date;
};

export function QuestionDetails({ question, answerUpdated, ...rest }: Props) {
  const sikkerhetskontroller = question.metadata.optionalFields?.find(
    (field) => field.key == 'Sikkerhetskontroller'
  )?.value[0];

  return (
    <Stack gap="1" {...rest}>
      <Text>{question.id}</Text>
      <Text fontSize="lg" as="b">
        {sikkerhetskontroller}
      </Text>
      <Text fontSize="lg">
        {'Svar sist endret ' + formatDateTime(answerUpdated)}
      </Text>
    </Stack>
  );
}
