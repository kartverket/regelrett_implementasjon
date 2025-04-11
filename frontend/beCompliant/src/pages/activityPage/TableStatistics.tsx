import { KvibProgress, HStack } from '@kvib/react';
import { Question } from '../../api/types';

interface Props {
  filteredData: Question[];
}

export const TableStatistics = ({ filteredData }: Props) => {
  const numberOfQuestions = filteredData.length;
  const numberOfAnswers = filteredData.reduce((count, data) => {
    if (data.answers?.[0]?.answer && data.answers.at(-1)?.answer !== '') {
      count++;
    }
    return count;
  }, 0);

  const percentageAnswered = Math.round(
    (numberOfAnswers / numberOfQuestions) * 100
  );

  return (
    <KvibProgress.Root
      value={isNaN(percentageAnswered) ? 0 : percentageAnswered}
      colorPalette="blue"
      maxW="40%"
    >
      <HStack gap="2">
        <KvibProgress.Track flex="1">
          <KvibProgress.Range />
        </KvibProgress.Track>
        <KvibProgress.ValueText fontSize="sm" fontWeight="semibold">
          {numberOfAnswers}/{numberOfQuestions} spørsmål besvart (
          {percentageAnswered}%)
        </KvibProgress.ValueText>
      </HStack>
    </KvibProgress.Root>
  );
};
