import { Checkbox, Stack } from '@kvib/react';
import { LastUpdated } from '../table/LastUpdated';
import { LastUpdatedQuestionPage } from '../questionPage/LastUpdatedQuestionPage';

type Props = {
  value: string | undefined;
  updated?: Date;
  setAnswerInput: React.Dispatch<React.SetStateAction<string | undefined>>;
  submitAnswer: (newAnswer: string) => void;
  isActivityPageView?: boolean;
};

export function CheckboxAnswer({
  value,
  updated,
  setAnswerInput,
  submitAnswer,
  isActivityPageView = false,
}: Props) {
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.checked ? 'checked' : 'unchecked';
    setAnswerInput(newValue);
    submitAnswer(newValue);
  };

  return (
    <Stack onClick={(e) => e.stopPropagation()}>
      <Checkbox
        colorScheme="blue"
        isChecked={value === 'checked'}
        onChange={handleOnChange}
        size="md"
      >
        {value ? (value === 'checked' ? 'Enig' : 'Uenig') : ''}
      </Checkbox>
      {isActivityPageView ? (
        <LastUpdated updated={updated} />
      ) : (
        <LastUpdatedQuestionPage lastUpdated={updated} />
      )}
    </Stack>
  );
}
