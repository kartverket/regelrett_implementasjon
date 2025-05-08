import { Question, User } from '../../api/types';
import { useEffect, useState } from 'react';
import { useSubmitAnswer } from '../../hooks/useAnswers';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  question: Question;
  latestAnswer: string;
  contextId: string;
  user: User;
};

export function TextAreaAnswer({
  question,
  latestAnswer,
  contextId,
  user,
}: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    latestAnswer
  );
  const { mutate: submitAnswer } = useSubmitAnswer(
    contextId,
    question.recordId
  );

  useEffect(() => {
    setAnswerInput(latestAnswer);
  }, [latestAnswer]);

  return (
    <Textarea
      value={answerInput}
      onChange={(e) => setAnswerInput(e.target.value)}
      className="w-1/2 resize-y bg-white"
      onBlur={() => {
        if (answerInput !== latestAnswer) {
          submitAnswer({
            actor: user.id,
            recordId: question.recordId ?? '',
            questionId: question.id,
            answer: answerInput ?? '',
            answerType: question.metadata.answerMetadata.type,
            contextId: contextId,
          });
        }
      }}
    />
  );
}
