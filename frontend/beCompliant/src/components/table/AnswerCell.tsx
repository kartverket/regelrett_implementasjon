import { Button, Input, Select, Stack, Textarea } from '@kvib/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Choice } from '../../types/tableTypes';
import colorUtils from '../../utils/colorUtils';
import { Comment } from './Comment';

type AnswerCellProps = {
  value: any;
  answerType: string;
  questionId: string;
  questionName: string;
  comment: string;
  choices?: Choice[];
};

export function AnswerCell({
  value,
  answerType,
  questionId,
  questionName,
  comment,
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
    case 'multilineText':
      return (
        <Stack spacing={2}>
          <Textarea value={selectedAnswer} onChange={handleTextAreaAnswer} />
          <Button onClick={submitTextAnswer}>Submit</Button>
          <Comment comment={comment} questionId={questionId} team={team} />
        </Stack>
      );
    case 'singleSelect':
      if (!choices)
        throw new Error(
          `Failed to fetch choices for single selection answer cell`
        );
      const selectedChoice = choices.find(
        (choice) => choice.name === selectedAnswer
      );
      const selectedAnswerBackgroundColor = selectedChoice
        ? (colorUtils.getHexForColor(selectedChoice.color) ?? undefined)
        : undefined;
      return (
        <Stack spacing={2}>
          <Select
            aria-label="select"
            placeholder="Velg alternativ"
            onChange={handleSelectionAnswer}
            value={selectedAnswer}
            width="170px"
            style={{ backgroundColor: selectedAnswerBackgroundColor }}
          >
            {choices.map((choice) => (
              <option value={choice.name} key={choice.id}>
                {choice.name}
              </option>
            ))}
          </Select>
          <Comment comment={comment} questionId={questionId} team={team} />
        </Stack>
      );
  }

  return (
    <Stack spacing={2}>
      <Input value={selectedAnswer} onChange={handleInputAnswer} />
      <Button onClick={submitTextAnswer}>Submit</Button>
      <Comment comment={comment} questionId={questionId} team={team} />
    </Stack>
  );
}
