import { IconButton, Stack, Textarea } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';

type Props = {
  value: string | undefined;
  updated?: Date;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
};

export function TextAnswer({
  value,
  updated,
  setAnswerInput,
  submitAnswer,
}: Props) {
  const handleTextAreaAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    setAnswerInput(value);
  };

  return (
    <Stack spacing={1} direction="column">
      <Stack spacing={2} direction="row" alignItems="center">
        <Textarea
          value={value}
          onChange={handleTextAreaAnswer}
          background="white"
        />
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
