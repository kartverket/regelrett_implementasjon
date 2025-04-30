import { useState } from 'react';
import { Answer, AnswerType, Question, User } from '../../api/types';
import { PercentAnswer } from '../../components/answers/PercentAnswer';
import { RadioAnswer } from './RadioAnswer';
import { TextAreaAnswer } from './TextAreaAnswer';
import { Button } from '@/components/ui/button';
import { TimeAnswer } from '../../components/answers/TimeAnswer';
import { CheckboxAnswer } from '../../components/answers/CheckboxAnswer';
import { useSubmitAnswer } from '../../hooks/useAnswers';
import { RefreshCw } from 'lucide-react';

type Props = {
  question: Question;
  answers: Answer[];
  contextId: string;
  user: User;
  choices?: string[] | null;
  answerExpiry: number | null;
};

export function QuestionAnswer({
  question,
  answers,
  contextId,
  user,
  choices,
  answerExpiry,
}: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    answers.at(-1)?.answer
  );
  const [answerUnit, setAnswerUnit] = useState<string | undefined>(
    answers.at(-1)?.answerUnit
  );
  const { mutate: submitAnswerHook } = useSubmitAnswer(
    contextId,
    question.recordId
  );

  const submitAnswer = (newAnswer: string, unitAnswer?: string) => {
    submitAnswerHook({
      actor: user.id,
      recordId: question.recordId,
      questionId: question.id,
      answer: newAnswer,
      answerUnit: unitAnswer,
      answerType: question.metadata.answerMetadata.type,
      contextId: contextId,
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-bold text-lg">Svar</p>
      {(() => {
        switch (question.metadata.answerMetadata.type) {
          case AnswerType.SELECT_SINGLE:
            return (
              <RadioAnswer
                question={question}
                latestAnswer={answers.at(-1)?.answer ?? ''}
                contextId={contextId}
                user={user}
              />
            );
          case AnswerType.TEXT_MULTI_LINE:
            return (
              <TextAreaAnswer
                question={question}
                latestAnswer={answers.at(-1)?.answer ?? ''}
                contextId={contextId}
                user={user}
              />
            );
          case AnswerType.PERCENT:
            return (
              <PercentAnswer
                value={answerInput}
                updated={answers.at(-1)?.updated}
                setAnswerInput={setAnswerInput}
                submitAnswer={submitAnswer}
                answerExpiry={answerExpiry}
              />
            );
          case AnswerType.TIME:
            return (
              <TimeAnswer
                value={answerInput}
                updated={answers.at(-1)?.updated}
                setAnswerInput={setAnswerInput}
                submitAnswer={submitAnswer}
                setAnswerUnit={setAnswerUnit}
                unit={answerUnit}
                units={question.metadata.answerMetadata.units}
                answerExpiry={answerExpiry}
              />
            );
          case AnswerType.CHECKBOX:
            return (
              <CheckboxAnswer
                value={answerInput}
                updated={answers.at(-1)?.updated}
                setAnswerInput={setAnswerInput}
                submitAnswer={submitAnswer}
                choices={choices}
                answerExpiry={answerExpiry}
              />
            );

          default:
            return <p>Denne svartypen blir ikke støttet</p>;
        }
      })()}
      {answers.length > 0 && (
        <Button
          aria-label="Forny svaret"
          className="flex justify-start has-[>svg]:px-0"
          variant={'link'}
          size="sm"
          onClick={() => {
            submitAnswer(
              answers.at(-1)?.answer ?? '',
              answers.at(-1)?.answerUnit
            );
          }}
        >
          <span className="text-xs">Forny svar</span>
          <RefreshCw />
        </Button>
      )}
    </div>
  );
}
