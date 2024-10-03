import { Text, RadioGroup, Radio, Stack, Textarea } from '@kvib/react';
import { Answer, AnswerType, Question } from '../../api/types';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { useEffect, useState } from 'react';

type Props = {
  question: Question;
  answers: Answer[];
  team: string;
};

export function QuestionAnswer({ question, answers, team }: Props) {
  const answer = answers.at(-1)?.answer ?? '';
  const [answerInput, setAnswerInput] = useState<string | undefined>(answer);
  const [answerUnit, setAnswerUnit] = useState<string | undefined>();

  const answerType = question.metadata.answerMetadata.type;

  const { mutate: submitAnswer } = useSubmitAnswers(team);

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer: string = e.target.value;
    submitAnswer({
      actor: 'Unknown',
      recordId: question.recordId ?? '',
      questionId: question.id,
      question: question.question,
      answer: newAnswer,
      updated: '',
      team: team,
      answerType: answerType,
    });
  };

  const submitTextAnswer = () => {
    if (answerInput !== answer) {
      submitAnswer({
        actor: 'Unknown',
        recordId: question.recordId ?? '',
        questionId: question.id,
        question: question.question,
        answer: answerInput ?? '',
        updated: '',
        team: team,
        answerType: answerType,
        answerUnit: answerUnit,
      });
    }
  };

  const handleTextAreaAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  useEffect(() => {
    setAnswerInput(answer);
  }, [answer]);

  switch (answerType) {
    case AnswerType.SELECT_SINGLE:
      return (
        <>
          <Text fontSize="lg" as="b">
            Svar
          </Text>
          <RadioGroup
            name="select-single-answer"
            defaultValue={answers.at(-1)?.answer}
          >
            <Stack direction="column">
              {question.metadata.answerMetadata.options?.map((option) => (
                <Radio
                  key={option}
                  value={option}
                  onChange={handleSelectionAnswer}
                  colorScheme="blue"
                >
                  {option}
                </Radio>
              ))}
            </Stack>
          </RadioGroup>
        </>
      );
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <>
          <Text fontSize="lg" as="b">
            Svar
          </Text>
          <Stack spacing={2} direction="row" alignItems="center">
            <Textarea
              value={answerInput}
              onChange={handleTextAreaAnswer}
              onBlur={submitTextAnswer}
              background="white"
              resize="vertical"
              width="50%"
            />
          </Stack>
        </>
      );
  }
}
