import { Text, Textarea, Stack, Flex } from '@kvib/react';
import { Question, User } from '../../api/types';
import { useEffect, useState } from 'react';
import { LastUpdated } from '../table/LastUpdated';
import { useSubmitAnswers } from '../../hooks/useAnswers';

type Props = {
  question: Question;
  latestAnswer: string;
  contextId: string;
  user: User;
  lastUpdated?: Date;
  answerExpiry: number | null;
};

export function TextAreaAnswer({
  question,
  latestAnswer,
  contextId,
  user,
  lastUpdated,
  answerExpiry,
}: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    latestAnswer
  );
  const { mutate: submitAnswer } = useSubmitAnswers(
    contextId,
    question.recordId
  );

  const submitTextAnswer = () => {
    submitAnswer({
      actor: user.id,
      recordId: question.recordId ?? '',
      questionId: question.id,
      answer: answerInput ?? '',
      answerType: question.metadata.answerMetadata.type,
      contextId: contextId,
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerInput(e.target.value);
  };

  useEffect(() => {
    setAnswerInput(latestAnswer);
  }, [latestAnswer]);

  return (
    <Flex flexDirection="column" gap="2" width="50%">
      <Text fontSize="lg" fontWeight="bold">
        Svar
      </Text>
      <Stack gap="2" direction="column">
        <Textarea
          value={answerInput}
          onChange={handleChange}
          backgroundColor="white"
          resize="vertical"
          onBlur={() => {
            if (answerInput !== latestAnswer) {
              submitTextAnswer();
            }
          }}
        />
      </Stack>
      <LastUpdated
        updated={lastUpdated}
        answerExpiry={answerExpiry}
        submitAnswer={submitTextAnswer}
        value={latestAnswer}
      />
    </Flex>
  );
}
