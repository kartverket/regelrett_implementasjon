import { Text, Textarea, Stack } from '@kvib/react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Question } from '../../api/types';
import { useEffect, useState } from 'react';

type Props = {
  question: Question;
  latestAnswer: string;
  team: string;
};

export function TextAreaAnswer({ question, latestAnswer, team }: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    latestAnswer
  );
  const { mutate: submitAnswer } = useSubmitAnswers(team);
  const submitTextAnswer = () => {
    if (answerInput !== latestAnswer) {
      submitAnswer({
        actor: 'Unknown',
        recordId: question.recordId ?? '',
        questionId: question.id,
        question: question.question,
        answer: answerInput ?? '',
        team: team,
        answerType: question.metadata.answerMetadata.type,
      });
    }
  };

  const handleTextAreaAnswer = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerInput(e.target.value);
  };

  useEffect(() => {
    setAnswerInput(latestAnswer);
  }, [latestAnswer]);

  return (
    <>
      <Text fontSize="lg" as="b">
        Svar
      </Text>
      <Stack spacing={2} direction="row" alignItems="center">
        <Textarea
          value={answerInput}
          onChange={handleTextAreaAnswer}
          onBlur={submitTextAnswer}
          background="white"
          resize="vertical"
          width="50%"
        />
      </Stack>
    </>
  );
}
