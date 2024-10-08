import { Text, Textarea, Stack, Button } from '@kvib/react';
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
  const { mutate: submitAnswer, isPending: isLoading } = useSubmitAnswers(team);
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
      <Stack spacing="2" direction="column">
        <Textarea
          value={answerInput}
          onChange={handleTextAreaAnswer}
          background="white"
          resize="vertical"
          width="50%"
        />
        <Button
          aria-label="Lagre svar"
          colorScheme="blue"
          leftIcon="check"
          variant="secondary"
          onClick={submitTextAnswer}
          isLoading={isLoading}
          isDisabled={answerInput === latestAnswer}
          width="fit-content"
        >
          Lagre svar
        </Button>
      </Stack>
    </>
  );
}
