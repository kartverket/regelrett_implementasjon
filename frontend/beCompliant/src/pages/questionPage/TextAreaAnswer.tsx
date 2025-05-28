import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';

type Props = {
  latestAnswer: string;
  submitAnswer: (newAnswer: string) => void;
};

export function TextAreaAnswer({ latestAnswer, submitAnswer }: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    latestAnswer
  );

  useEffect(() => {
    setAnswerInput(latestAnswer);
  }, [latestAnswer]);

  return (
    <Textarea
      value={answerInput}
      onChange={(e) => setAnswerInput(e.target.value)}
      className="w-1/2 resize-y bg-input"
      onBlur={() => {
        if (answerInput !== latestAnswer) {
          submitAnswer(answerInput ?? '');
        }
      }}
    />
  );
}
