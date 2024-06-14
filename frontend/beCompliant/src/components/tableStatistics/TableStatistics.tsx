import { Text } from '@kvib/react';

interface TableStatisticsProps {
  numberOfQuestions: number;
  numberOfAnswers: number;
}

export const TableStatistics = (props: TableStatisticsProps) => {
  const { numberOfQuestions, numberOfAnswers } = props;
  return (
    <Text style={{ margin: 20 }}><Text as={'b'}>{numberOfAnswers}</Text> av {numberOfQuestions} spørsmål besvart</Text>
  );
};