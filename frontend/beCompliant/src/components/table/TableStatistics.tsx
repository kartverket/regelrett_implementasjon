import { CircularProgress, CircularProgressLabel, Text } from '@kvib/react';
import { Question } from '../../api/types';

interface Props {
  filteredData: Question[];
}

export const TableStatistics = ({ filteredData }: Props) => {
  const numberOfQuestions = filteredData?.length;
  const numberOfAnswers = filteredData.reduce((count, data) => {
    if (data.answers[0]?.answer && data.answers.at(-1)?.answer !== '') {
      count++;
    }
    return count;
  }, 0);
  const percentageAnswered = Math.round(
    (numberOfAnswers / numberOfQuestions) * 100
  );

  return (
    <>
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
      <CircularProgress
        size="150px"
        value={percentageAnswered}
        width="fit-content"
        color="blue.500"
        trackColor="blue.100"
        capIsRound={true}
      >
        <CircularProgressLabel>
          <Text fontWeight={700}>{numberOfAnswers}</Text>
        </CircularProgressLabel>
      </CircularProgress>
    </>
  );
};
