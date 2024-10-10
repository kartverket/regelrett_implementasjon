import { useState } from 'react';
import { Answer, AnswerType, Question } from '../../api/types';
import { PercentAnswer } from '../answers/PercentAnswer';
import { RadioAnswer } from './RadioAnswer';
import { TextAreaAnswer } from './TextAreaAnswer';
import { Flex, Text } from '@kvib/react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { TimeAnswer } from '../answers/TimeAnswer';

type Props = {
  question: Question;
  answers: Answer[];
  team?: string;
  functionId?: number;
  isAnswerEdited: boolean;
  setIsAnswerEdited: (value: boolean) => void;
};

export function QuestionAnswer({
  question,
  answers,
  team,
  isAnswerEdited,
  setIsAnswerEdited,
  functionId,
}: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    answers.at(-1)?.answer
  );
  const [answerUnit, setAnswerUnit] = useState<string | undefined>(
    answers.at(-1)?.answerUnit
  );
  const { mutate: submitAnswerHook } = useSubmitAnswers(team);

  const submitAnswer = (newAnswer: string, unitAnswer?: string) => {
    submitAnswerHook({
      actor: 'Unknown',
      recordId: question.recordId,
      questionId: question.id,
      question: question.question,
      answer: newAnswer,
      answerUnit: unitAnswer,
      team: team,
      answerType: question.metadata.answerMetadata.type,
    });
  };

  switch (question.metadata.answerMetadata.type) {
    case AnswerType.SELECT_SINGLE:
      return (
        <RadioAnswer
          question={question}
          latestAnswer={answers.at(-1)?.answer ?? ''}
          team={team}
          functionId={functionId}
        />
      );
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <TextAreaAnswer
          question={question}
          latestAnswer={answers.at(-1)?.answer ?? ''}
          team={team}
          functionId={functionId}
          isAnswerEdited={isAnswerEdited}
          setIsAnswerEdited={setIsAnswerEdited}
        />
      );
    case AnswerType.PERCENT:
      return (
        <Flex flexDirection="column" gap="2" width="50%">
          <Text fontSize="lg" as="b">
            Svar
          </Text>
          <PercentAnswer
            value={answerInput}
            updated={answers.at(-1)?.updated}
            setAnswerInput={setAnswerInput}
            submitAnswer={submitAnswer}
          />
        </Flex>
      );
    case AnswerType.TIME:
      return (
        <Flex flexDirection="column" gap="2" width="50%">
          <Text fontSize="lg" as="b">
            Svar
          </Text>
          <TimeAnswer
            value={answerInput}
            updated={answers.at(-1)?.updated}
            setAnswerInput={setAnswerInput}
            submitAnswer={submitAnswer}
            setAnswerUnit={setAnswerUnit}
            unit={answerUnit}
            choices={question.metadata.answerMetadata.options}
          />
        </Flex>
      );

    default:
      return <Text>Denne svartypen blir ikke støttet</Text>;
  }
}
