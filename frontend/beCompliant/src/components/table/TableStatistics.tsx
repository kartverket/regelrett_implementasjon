import { Text } from '@kvib/react';
import { RecordType } from '../../types/tableTypes';

interface Props {
  filteredData: RecordType[];
}

export const TableStatistics = ({ filteredData }: Props) => {
  const numberOfQuestions = filteredData.length;
  const numberOfAnswers = filteredData.reduce((count, data) => {
    if (data.fields.Svar) {
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
