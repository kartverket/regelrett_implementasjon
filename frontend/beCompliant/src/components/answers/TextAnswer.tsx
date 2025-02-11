import { Input, Stack, Textarea } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';
import { useRef } from 'react';

type Props = {
  value: string | undefined;
  updated?: Date;
  multipleLines?: boolean;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
  answerExpiry: number | null;
  disabled?: boolean;
};

export function TextAnswer({
  value,
  updated,
  multipleLines,
  setAnswerInput,
  submitAnswer,
  answerExpiry,
  disabled,
}: Props) {
  const initialValue = useRef(value).current;

  const handleTextAnswer = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  return (
    <Stack spacing={1} direction="column">
      <Stack spacing={2} direction="row" alignItems="center">
        {multipleLines ? (
          <Textarea
            value={value}
            onChange={handleTextAnswer}
            backgroundColor="white"
            onBlur={() => {
              if (value != initialValue) {
                submitAnswer(value ?? '');
              }
            }}
            disabled={disabled}
          />
        ) : (
          <Input
            value={value}
            onChange={handleTextAnswer}
            backgroundColor="white"
            disabled={disabled}
            isDisabled={disabled}
          />
        )}
      </Stack>
      <LastUpdated
        updated={updated}
        answerExpiry={answerExpiry}
        submitAnswer={submitAnswer}
        value={value}
        isActivityPageView
      />
    </Stack>
  );
}
