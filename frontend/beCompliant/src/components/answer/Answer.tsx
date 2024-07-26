import { Button, Select, Textarea } from '@kvib/react';
import React, { useEffect, useState } from 'react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { useSubmitComment } from '../../hooks/useSubmitComment';
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
  comment?: string;
}

export const Answer = ({
  choices,
  answer,
  record,
  team,
  comment,
}: AnswerProps) => {
  const QUESTION_PLACEHOLDER_VALUE = 'Velg alternativ';
  const [selectedAnswer, setSelectedAnswer] = useState<string>(answer);
  const [selectedComment, setComment] = useState<string | undefined>(comment);
  const [commentIsOpen, setCommentIsOpen] = useState<boolean>(comment !== '');

  const { mutate: submitAnswer } = useSubmitAnswers();
  const { mutate: submitComment, isPending: isLoadingComment } =
    useSubmitComment();

  const backgroundColor = selectedAnswer
    ? (colorUtils.getHexForColor(
        choices.find((choice) => choice.name === selectedAnswer)!.color
      ) ?? undefined)
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

  const handleCommentSubmit = () => {
    if (selectedComment !== comment) {
      submitComment(
        {
          actor: 'Unknown',
          questionId: record.fields.ID,
          team: team,
          comment: selectedComment,
          updated: '',
        },
        { onSuccess: () => setCommentIsOpen(false) }
      );
    }
  };

  const handleCommentState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  return (
    <>
      <Select
        aria-label="select"
        placeholder={QUESTION_PLACEHOLDER_VALUE}
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
      <Button
        onClick={() => setCommentIsOpen(!commentIsOpen)}
        marginTop={2}
        size="xs"
        width="170px"
      >
        Kommentar
      </Button>
      {commentIsOpen && (
        <>
          <Textarea
            marginBottom={2}
            marginTop={2}
            defaultValue={comment}
            onChange={handleCommentState}
            size="sm"
          />
          <Button onClick={handleCommentSubmit} isLoading={isLoadingComment}>
            Lagre kommentar
          </Button>
        </>
      )}
    </>
  );
};
