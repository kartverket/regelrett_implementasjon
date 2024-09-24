import { Text } from '@kvib/react';
import { Question } from '../../api/types';

interface Props {
  filteredData: Question[];
}

export const TableStatistics = ({ filteredData }: Props) => {
  const numberOfQuestions = filteredData?.length;
  const numberOfAnswers = filteredData.reduce((count, data) => {
    if (data.answers[0]?.Svar) {
      count++;
    }
    return count;
  }, 0);

  return (
    <Text minHeight="28px" fontSize="lg">
      <Text fontSize="lg" as="b">
        {numberOfAnswers}
      </Text>{' '}
      av{' '}
      <Text fontSize="lg" as="b">
        {numberOfQuestions}
      </Text>{' '}
      spørsmål besvart
    </Text>
  );
};
