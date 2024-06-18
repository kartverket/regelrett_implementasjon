import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Select, useToast } from '@kvib/react';
import { RecordType } from '../../pages/Table';

export type AnswerType = {
  questionId: string;
  Svar: string;
  updated: string;
};

interface AnswerProps {
  choices: string[] | [];
  answer: string;
  record: RecordType;
  setFetchNewAnswers: Dispatch<SetStateAction<boolean>>;
  team?: string;
  key: string;
}

export const Answer = ({
  choices,
  answer,
  record,
  setFetchNewAnswers,
  team,
  key,
}: AnswerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    answer
  );

  const toast = useToast();

  useEffect(() => {
    setSelectedAnswer(answer);
  }, [choices, answer]);

  const submitAnswer = async (answer: string, record: RecordType) => {
    const url = 'http://localhost:8080/answer'; // TODO: Place dev url to .env file
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: 'Unknown',
        questionId: record.fields.ID,
        question: record.fields.Aktivitet,
        Svar: answer,
        updated: '',
        team: team,
      }),
    };
    try {
      const response = await fetch(url, settings);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      toast({
        title: 'Suksess',
        description: "Svaret ditt er lagret",
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      setFetchNewAnswers(true);
    } catch (error) {
      console.error('There was an error with the submitAnswer request:', error);
      toast({
        title: 'Å nei!',
        description: "Det har skjedd en feil. Prøv på nytt",
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
    return;
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value;
    setSelectedAnswer(newAnswer);
    submitAnswer(newAnswer, record);
  };

  return (
    <Select
      aria-label="select"
      placeholder="Velg alternativ"
      onChange={handleChange}
      value={selectedAnswer}
      width="170px"
      key={key}
    >
      {choices.map((choice) => (
        <option value={choice} key={choice}>
          {choice}
        </option>
      ))}
    </Select>
  );
};
