import { Button, Input, Select, Stack, Textarea } from '@kvib/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { AnswerType } from '../../api/types';

type AnswerCellProps = {
  value: any;
  answerType: AnswerType;
  questionId: string;
  questionName: string;
  comment: string;
  choices?: string[] | null;
};

export function AnswerCell({
  value,
  answerType,
  questionId,
  questionName,
  choices,
}: AnswerCellProps) {
  const params = useParams();
  const team = params.teamName;

  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    value
  );

  const { mutate: submitAnswer } = useSubmitAnswers();

  const handleInputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSelectedAnswer(value);
  };

  const handleTextAreaAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setSelectedAnswer(value);
  };

  const submitTextAnswer = () => {
    submitAnswer({
      actor: 'Unknown',
      questionId: questionId,
      question: questionName,
      Svar: selectedAnswer ?? '',
      updated: '',
      team: team,
    });
  };

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value;
    setSelectedAnswer(newAnswer);
    submitAnswer({
      actor: 'Unknown',
      questionId: questionId,
      question: questionName,
      Svar: newAnswer,
      updated: '',
      team: team,
    });
  };

  switch (answerType) {
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <Stack spacing={2}>
          <Textarea
            value={selectedAnswer}
            onChange={handleTextAreaAnswer}
            background="white"
          />
          <Button onClick={submitTextAnswer}>Submit</Button>
        </Stack>
      );
    case AnswerType.SELECT_SINGLE:
      if (!choices)
        throw new Error(
          `Failed to fetch choices for single selection answer cell`
        );
      return (
        <Stack spacing={2}>
          <Select
            aria-label="select"
            placeholder="Velg alternativ"
            onChange={handleSelectionAnswer}
            value={selectedAnswer}
            width="170px"
            background="white"
          >
            {choices.map((choice) => (
              <option value={choice} key={choice}>
                {choice}
              </option>
            ))}
          </Select>
        </Stack>
      );
  }

  return (
    <Stack spacing={2}>
      <Input value={selectedAnswer} onChange={handleInputAnswer} />
      <Button colorScheme={'blue'} onClick={submitTextAnswer}>
        Submit
      </Button>
    </Stack>
  );
}
