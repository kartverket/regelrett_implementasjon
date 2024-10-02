import {
  Button,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
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

type Props = {
  value: any;
  answerType: AnswerType;
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

  const [answerUnit, setAnswerUnit] = useState<string | undefined>();

  const { mutate: submitAnswer } = useSubmitAnswers(team);
  const [numericTimeValue, setNumericTimeValue] = useState<string>('');
  const [selectedTimeUnit, setSelectedTimeUnit] = useState<
    string | undefined
  >();
  

  const handleInputAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  const handleTextAreaAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  const handlePercentAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (
      !isNaN(numericValue) &&
      numericValue >= 0 &&
      numericValue <= 100 &&
      value.length <= 4
    ) {
      setAnswerInput(value);
    }
  };

  const handleTimeAnswerValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (!isNaN(numericValue) && numericValue >= 0 && value.length <= 4) {
      setNumericTimeValue(value);
    }
  };

  const handleTimeAnswerUnit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTimeUnit = e.target.value;
    setSelectedTimeUnit(newTimeUnit);

    if (numericTimeValue) {
      const answer = `${numericTimeValue} ${newTimeUnit}`;
      setAnswerInput(answer);
    } else {
      setAnswerInput(newTimeUnit);
    }
  };

  const submitTextAnswer = () => {
    submitAnswer({
      actor: 'Unknown',
      recordId: recordId,
      questionId: questionId,
      question: questionName,
      answer: answerInput ?? '',
      team: team,
      answerType: answerType,
      answerUnit: answerUnit,
    });
  };

  const submitPercentAnswer = () => {
    submitAnswer({
      actor: 'Unknown',
      questionId: questionId,
      question: questionName,
      answer: answerInput ?? '',
      updated: '',
      team: team,
    });
  };

  const submitTimeAnswer = () => {
      submitAnswer({
          actor: 'Unknown',
          recordId: recordId,
          questionId: questionId,
          question: questionName,
          answer: answerInput ?? '',
          updated: '',
          team: team,
          answerType: answerType,
          ...(answerUnit != null && { answerUnit }),
      });
  };

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value;
    setAnswerInput(newAnswer);
    submitAnswer({
      actor: 'Unknown',
      recordId: recordId,
      questionId: questionId,
      question: questionName,
      answer: newAnswer,
      team: team,
      answerType: answerType,
      answerUnit: answerUnit,
    });
  };

  switch (answerType) {
    case AnswerType.TEXT_MULTI_LINE:
      return (
        <Stack spacing={2} direction="row" alignItems="center">
          <Textarea
            value={answerInput}
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
        (option) => option.name === answerInput
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
            value={answerInput}
            width="170px"
            background={selectedAnswerBackgroundColor}
            marginBottom={updated ? '0' : '6'}
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
    case AnswerType.PERCENT:
      return (
        <Stack spacing={2} direction="row">
          <InputGroup>
            <NumberInput
              value={answerInput}
              background={'white'}
              borderRadius="5px"
            >
              <NumberInputField
                onChange={handlePercentAnswer}
                type="number"
                borderRight={'none'}
                borderRightRadius={0}
              />
            </NumberInput>
            <InputRightAddon
              children={'%'}
              background={'white'}
              borderLeft={'none'}
              backgroundColor={'#E3E0E0'}
              width={4}
              border="1px solid"
              borderColor="gray.400"
              display="flex"
              justifyContent="center"
              color="gray.500"
            />
          </InputGroup>
          <IconButton
            aria-label={'Lagre prosentsvar'}
            icon="check"
            colorScheme="blue"
            variant="secondary"
            onClick={submitPercentAnswer}
            background="white"
          >
            Submit
          </IconButton>
        </Stack>
      );
    case AnswerType.TIME:
      return (
        <Stack spacing={2} direction="row" alignItems="center">
          <InputGroup>
            <NumberInput
              marginRight="1"
              value={numericTimeValue}
              background={'white'}
            >
              <NumberInputField
                onChange={handleTimeAnswerValue}
                type="number"
              />
            </NumberInput>
            <Select
              minWidth="20"
              background="white"
              value={selectedTimeUnit}
              onChange={handleTimeAnswerUnit}
            >
              {choices?.map((choice) => (
                <option value={choice} key={choice}>
                  {choice}
                </option>
              ))}
            </Select>
          </InputGroup>
          <IconButton
            aria-label={'Lagre tidssvar'}
            icon="check"
            colorScheme="blue"
            variant="secondary"
            onClick={submitTimeAnswer}
            background="white"
          >
            Submit
          </IconButton>
        </Stack>
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
