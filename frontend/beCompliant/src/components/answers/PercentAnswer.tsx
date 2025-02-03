import {
  IconButton,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  Stack,
  Tooltip,
} from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';
import { useRef } from 'react';

type Props = {
  value: string | undefined;
  updated?: Date;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
  isActivityPageView?: boolean;
  answerExpiry: number | null;
  disabled?: boolean;
};

export function PercentAnswer({
  value,
  updated,
  setAnswerInput,
  submitAnswer,
  isActivityPageView = false,
  answerExpiry,
  disabled,
}: Props) {
  const initialValue = useRef(value).current;

  const handlePercentAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const numericValue = Number(value);
    if (
      !isNaN(numericValue) &&
      numericValue >= 0 &&
      numericValue <= 100 &&
      value.length <= 7
    ) {
      setAnswerInput(value);
    }
  };

  return (
    <Stack spacing={1} direction="column">
      <Stack spacing={2} direction="row">
        <InputGroup width="fit-content">
          <InputLeftAddon
            background={'White'}
            border="1px solid"
            borderColor="gray.400"
          >
            <Tooltip label="Forny svaret" aria-label="Forny svaret">
              <IconButton
                aria-label="Forny svaret"
                icon="update"
                color="black"
                variant="tertiary"
                size="xs"
              />
            </Tooltip>
          </InputLeftAddon>
          <NumberInput value={value} background={'white'} borderRadius="5px">
            <NumberInputField
              onChange={handlePercentAnswer}
              type="number"
              borderRight={'none'}
              borderLeft={'none'}
              borderRightRadius={0}
              borderLeftRadius={0}
              onBlur={() => {
                if (value != initialValue) {
                  submitAnswer(value ?? '');
                }
              }}
              disabled={disabled}
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
      </Stack>
      <LastUpdated
        updated={updated}
        answerExpiry={answerExpiry}
        submitAnswer={submitAnswer}
        value={value}
        isActivityPageView={isActivityPageView}
      />
    </Stack>
  );
}
