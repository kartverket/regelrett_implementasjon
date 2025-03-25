import { AbsoluteCenter, KvibProgressCircle, Mark, Text } from '@kvib/react';
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

  const percentageAnswered = Math.round(numberOfAnswers / numberOfQuestions);

  return (
    <>
      <Text minHeight="28px" fontSize="lg">
        <Mark fontWeight="bold">{numberOfAnswers}</Mark> av{' '}
        <Mark fontWeight="bold">{numberOfQuestions}</Mark> spørsmål besvart
      </Text>
      <KvibProgressCircle.Root
        value={isNaN(percentageAnswered) ? 0 : percentageAnswered}
        size="xl"
        colorPalette="blue"
      >
        <KvibProgressCircle.Circle>
          <KvibProgressCircle.Track />
          <KvibProgressCircle.Range strokeLinecap="round" />
        </KvibProgressCircle.Circle>
        <AbsoluteCenter>
          <KvibProgressCircle.Label>
            <Text fontWeight="bold">{numberOfAnswers}</Text>
          </KvibProgressCircle.Label>
        </AbsoluteCenter>
      </KvibProgressCircle.Root>
    </>
  );
};
