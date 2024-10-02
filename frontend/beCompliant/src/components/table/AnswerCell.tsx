import {
  Button,
  IconButton,
  Input,
  Select,
  Stack,
  Textarea,
} from '@kvib/react';
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { AnswerType } from '../../api/types';
import { LastUpdated } from './LastUpdated';
import { Option } from '../../api/types';
import colorUtils from '../../utils/colorUtils';

type Props = {
  value: any;
  answerType: AnswerType;
  questionId: string;
  questionName: string;
  comment: string;
  updated?: Date;
  choices?: string[] | null;
  options?: Option[] | null;
};

export function AnswerCell({
  value,
  answerType,
  questionId,
  questionName,
  updated,
  choices,
  options,
}: Props) {
  const params = useParams();
  const team = params.teamName;

  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    value
  );

  const { mutate: submitAnswer } = useSubmitAnswers(team);

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
      answer: selectedAnswer ?? '',
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
      answer: newAnswer,
      team: team,
    });
  };

  switch (answerType) {
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <Stack spacing={2} direction="row" alignItems="center">
          <Textarea
            value={selectedAnswer}
            onChange={handleTextAreaAnswer}
            background="white"
          />
          <IconButton
            aria-label={'Lagre tekstsvar'}
            icon="check"
            colorScheme="blue"
            variant="secondary"
            onClick={submitTextAnswer}
            background="white"
          >
            Submit
          </IconButton>
        </Stack>
      );
    case AnswerType.SELECT_SINGLE:
      if (!choices)
        throw new Error(
          `Failed to fetch choices for single selection answer cell`
        );

      const selectedColor = options?.find(
        (option) => option.name === selectedAnswer
      )?.color;

      const selectedAnswerBackgroundColor = selectedColor
        ? (colorUtils.getHexForColor(selectedColor) ?? 'white')
        : 'white';

      return (
        <Stack spacing={1}>
          <Select
            aria-label="select"
            placeholder="Velg alternativ"
            onChange={handleSelectionAnswer}
            value={selectedAnswer}
            width="170px"
            background={selectedAnswerBackgroundColor}
          >
            {choices.map((choice) => (
              <option value={choice} key={choice}>
                {choice}
              </option>
            ))}
          </Select>
          {updated && <LastUpdated updated={updated} />}
        </Stack>
      );
  }

  return (
    <Stack spacing={2}>
      <Input value={selectedAnswer} onChange={handleInputAnswer} />
      <Button colorScheme="blue" onClick={submitTextAnswer}>
        Submit
      </Button>
    </Stack>
  );
}
