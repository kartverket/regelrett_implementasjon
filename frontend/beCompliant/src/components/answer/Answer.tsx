import { Select } from '@kvib/react';
import React, { useEffect, useState } from 'react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Choice, RecordType } from '../../types/tableTypes';
import colorUtils from '../../utils/colorUtils';

export type AnswerType = {
  questionId: string;
  Svar: string;
  updated: string;
  comment: string;
};

interface AnswerProps {
  choices: Choice[] | [];
  answer: string;
  record: RecordType;
  team?: string;
}

export const Answer = ({ choices, answer, record, team }: AnswerProps) => {
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    answer
  );
  const { mutate: submitAnswer } = useSubmitAnswers();

  const backgroundColor = selectedAnswer
    ? colorUtils.getHexForColor(
        choices.find((choice) => choice.name === selectedAnswer)!.color
      ) ?? undefined
    : undefined;

  useEffect(() => {
    setSelectedAnswer(answer);
  }, [choices, answer]);

  const handleAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value;
    setSelectedAnswer(newAnswer);
    submitAnswer({
      actor: 'Unknown',
      questionId: record.fields.ID,
      question: record.fields.Aktivitet,
      Svar: newAnswer,
      updated: '',
      team: team,
    });
  };

  return (
    <>
      <Select
        aria-label="select"
        placeholder="Velg alternativ"
        onChange={handleAnswer}
        value={selectedAnswer}
        width="170px"
        style={{ backgroundColor: backgroundColor }}
        marginBottom={2}
      >
        {choices.map((choice) => (
          <option value={choice.name} key={choice.id}>
            {choice.name}
          </option>
        ))}
      </Select>
    </>
  );
};
