import { IconButton, Input, Stack, Textarea } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';

type Props = {
  value: string | undefined;
  updated?: Date;
  multipleLines?: boolean;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
};

export function TextAnswer({
  value,
  updated,
  multipleLines,
  setAnswerInput,
  submitAnswer,
}: Props) {
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
            background="white"
          />
        ) : (
          <Input value={value} onChange={handleTextAnswer} background="white" />
        )}
        <IconButton
          aria-label={'Lagre tekstsvar'}
          icon="check"
          colorScheme="blue"
          variant="secondary"
          onClick={() => submitAnswer(value ?? '')}
          background="white"
        >
          Submit
        </IconButton>
      </Stack>
      <LastUpdated updated={updated} />
    </Stack>
  );
}
