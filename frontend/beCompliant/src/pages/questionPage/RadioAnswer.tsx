import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Question, User } from '../../api/types';
import { useSubmitAnswer } from '../../hooks/useAnswers';

type Props = {
  question: Question;
  latestAnswer: string;
  contextId: string;
  user: User;
};

export function RadioAnswer({
  question,
  latestAnswer,
  contextId,
  user,
}: Props) {
  const { mutate: submitAnswer } = useSubmitAnswer(
    contextId,
    question.recordId
  );
  const { type: answerType, options } = question.metadata.answerMetadata;

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitRadioAnswer(e.target.value);
  };

  const submitRadioAnswer = (answer: string) => {
    submitAnswer({
      actor: user.id,
      recordId: question.recordId ?? '',
      questionId: question.id,
      answer: answer,
      answerType: answerType,
      contextId: contextId,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <RadioGroup
        defaultValue={latestAnswer}
        onValueChange={(value) =>
          handleSelectionAnswer({ target: { value } } as any)
        }
        className="flex flex-col"
      >
        {options?.map((option) => (
          <div key={option} className="flex items-center space-x-2">
            <RadioGroupItem value={option} id={option} />
            <Label htmlFor={option}>{option}</Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
}
