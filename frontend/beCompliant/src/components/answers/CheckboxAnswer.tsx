import { Checkbox, Stack } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';
import { useState } from 'react';

type Props = {
  updated?: Date;
  choices?: string[] | null;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
};

export function CheckboxAnswer({
  updated,
  choices,
  setAnswerInput,
  submitAnswer,
}: Props) {
  const [checkedItems, setCheckedItems] = useState([false, false]);

  const handleCheckboxAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer: string = e.target.value;
    setAnswerInput(newAnswer);
    submitAnswer(newAnswer ?? '');
  };

  if (!choices)
    throw new Error(`Failed to fetch choices for single selection answer cell`);

  return (
    <Stack spacing={1}>
      {choices.map((choice) => (
        <Checkbox onChange={(e) => handleCheckboxAnswer(e)}>{choice}</Checkbox>
      ))}
      <LastUpdated updated={updated} />
    </Stack>
  );
}
