import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  NumberInput,
  NumberInputField,
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
import { PercentAnswer } from '../answers/PercentAnswer';
import { TimeAnswer } from '../answers/TimeAnswer';
import { TextAnswer } from '../answers/TextAnswer';
import { SingleSelectAnswer } from '../answers/SingleSelectAnswer';

type Props = {
  value: any;
  answerType: AnswerType;
  unit?: string;
  questionId: string;
  recordId: string;
  questionName: string;
  comment: string;
  updated?: Date;
  choices?: string[] | null;
  options?: Option[] | null;
};

export function AnswerCell({
  value,
  answerType,
  unit,
  questionId,
  recordId,
  questionName,
  updated,
  choices,
  options,
}: Props) {
  const params = useParams();
  const team = params.teamId;

  const [answerInput, setAnswerInput] = useState<string | undefined>(value);
  const [answerUnit, setAnswerUnit] = useState<string | undefined>(unit);
  const { mutate: submitAnswerHook } = useSubmitAnswers(team);

  const handleInputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  const submitTextAnswer = () => {
    submitAnswerHook({
      actor: 'Unknown',
      recordId: recordId,
      questionId: questionId,
      question: questionName,
      answer: answerInput ?? '',
      team: team,
      answerType: answerType,
    });
  };

  const submitAnswer = (newAnswer: string, unitAnswer?: string) => {
    submitAnswerHook({
      actor: 'Unknown',
      recordId: recordId,
      questionId: questionId,
      question: questionName,
      answer: newAnswer,
      answerUnit: unitAnswer,
      team: team,
      answerType: answerType,
    });
  };

  switch (answerType) {
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <TextAnswer
          value={answerInput}
          updated={updated}
          setAnswerInput={setAnswerInput}
          submitAnswer={submitAnswer}
        />
      );
    case AnswerType.SELECT_SINGLE:
      return (
        <SingleSelectAnswer
          value={answerInput}
          updated={updated}
          choices={choices}
          options={options}
          setAnswerInput={setAnswerInput}
          submitAnswer={submitAnswer}
        />
      );
    case AnswerType.PERCENT:
      return (
        <PercentAnswer
          value={answerInput}
          updated={updated}
          setAnswerInput={setAnswerInput}
          submitAnswer={submitAnswer}
        />
      );
    case AnswerType.TIME:
      return (
        <TimeAnswer
          value={answerInput}
          unit={answerUnit}
          updated={updated}
          choices={choices}
          setAnswerInput={setAnswerInput}
          setAnswerUnit={setAnswerUnit}
          submitAnswer={submitAnswer}
        />
      );
  }

  return (
    <Stack spacing={2}>
      <Input value={answerInput} onChange={handleInputAnswer} />
      <Button colorScheme="blue" onClick={submitTextAnswer}>
        Submit
      </Button>
    </Stack>
  );
}
