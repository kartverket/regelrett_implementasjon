import { Checkbox, Stack } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';

type Props = {
  value: string | undefined;
  updated?: Date;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
  showLastUpdated?: boolean;
};

export function CheckboxAnswer({
  value,
  updated,
  setAnswerInput,
  submitAnswer,
  showLastUpdated = false,
}: Props) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked ? 'checked' : 'unchecked';
    setAnswerInput(newValue);
    submitAnswer(newValue);
  };

  return (
    <Stack>
      <Checkbox
        colorScheme="blue"
        isChecked={value === 'checked'}
        onChange={handleOnChange}
        size="md"
      >
        {value ? (value === 'checked' ? 'Enig' : 'Uenig') : ''}
      </Checkbox>
      {showLastUpdated && <LastUpdated updated={updated} />}
    </Stack>
  );
}
