import { Question } from '../../api/types';
import { Progress } from '@/components/ui/progress';

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
    <div className="max-w-[40%]">
      <div className="flex items-center gap-2">
        <Progress
          value={isNaN(percentageAnswered) ? 0 : percentageAnswered}
          className="flex-1"
        />
        <span className="text-sm font-semibold">
          {numberOfAnswers}/{numberOfQuestions} spørsmål besvart (
          {percentageAnswered}%)
        </span>
      </div>
    </div>
  );
};
