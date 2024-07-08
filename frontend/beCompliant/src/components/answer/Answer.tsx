import { Button, Select, Textarea, useToast } from '@kvib/react';
import React, { useEffect, useState } from 'react';
import colorUtils from '../../utils/colorUtils';
import useBackendUrl from '../../hooks/backendUrl';
import { Choice, RecordType } from '../../types/tableTypes';
import { useAnswersFetcher } from '../../hooks/answersFetcher';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { useSubmitComment } from '../../hooks/useSubmitComment';

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
  const [selectedAnswer, setSelectedAnswer] = useState<string | undefined>(
    answer
  );
  const [selectedComment, setComment] = useState<string | undefined>(comment);
  const [commentIsOpen, setCommentIsOpen] = useState<boolean>(comment !== '');

  const { setFetchAnswers } = useAnswersFetcher();
  const { mutate: submitAnswer } = useSubmitAnswers();
  const { mutate: submitComment } = useSubmitComment();

  const backgroundColor = selectedAnswer
    ? colorUtils.getHexForColor(
        choices.find((choice) => choice.name === selectedAnswer)!.color
      ) ?? undefined
    : undefined;

  const toast = useToast();

  useEffect(() => {
    setSelectedAnswer(answer);
  }, [choices, answer]);

  const submitAnswer2 = async (record: RecordType, answer?: string) => {
    const URL = useBackendUrl('/answer');
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
      const response = await fetch(URL, settings);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      toast({
        title: 'Suksess',
        description: 'Svaret ditt er lagret',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFetchAnswers(true);
    } catch (error) {
      console.error('There was an error with the submitAnswer request:', error);
      toast({
        title: 'Å nei!',
        description: 'Det har skjedd en feil. Prøv på nytt',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
    return;
  };

  const submitComment2 = async (record: RecordType, comment?: string) => {
    const URL = useBackendUrl('/comments');
    const settings = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        actor: 'Unknown',
        questionId: record.fields.ID,
        team: team,
        comment: comment,
        updated: '',
      }),
    };
    try {
      const response = await fetch(URL, settings);
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
      toast({
        title: 'Suksess',
        description: 'Kommentaren din er lagret',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error submitting comment', error);
      toast({
        title: 'Å nei!',
        description: 'Det har skjedd en feil. Prøv på nytt',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleAnswer = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAnswer: string = e.target.value;
    if (newAnswer.length > 0) {
      setSelectedAnswer(newAnswer);
      submitAnswer({
        actor: 'Unknown',
        questionId: record.fields.ID,
        question: record.fields.Aktivitet,
        Svar: newAnswer,
        updated: '',
        team: team,
      });
    }
  };

  const handleCommentSubmit = () => {
    if (selectedComment !== comment) {
      submitComment({
        actor: 'Unknown',
        questionId: record.fields.ID,
        team: team,
        comment: selectedComment,
        updated: '',
      });
    }
  };

  const handleCommentState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
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
          <Button onClick={handleCommentSubmit}>Lagre kommentar</Button>
        </>
      )}
    </>
  );
};
