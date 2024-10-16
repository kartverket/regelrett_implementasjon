import { Text, Textarea, Stack, Button, Flex } from '@kvib/react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Question } from '../../api/types';
import { useEffect, useState } from 'react';

type Props = {
  question: Question;
  latestAnswer: string;
  tableId: string;
  contextId: string;
  isAnswerEdited: boolean;
  setIsAnswerEdited: (value: boolean) => void;
};

export function TextAreaAnswer({
  question,
  latestAnswer,
  tableId,
  contextId,
  isAnswerEdited,
  setIsAnswerEdited,
}: Props) {
  const [answerInput, setAnswerInput] = useState<string | undefined>(
    latestAnswer
  );
  const { mutate: submitAnswer, isPending: isLoading } = useSubmitAnswers(
    tableId,
    contextId
  );

  const submitTextAnswer = () => {
    if (answerInput !== latestAnswer) {
      submitAnswer({
        actor: 'Unknown',
        recordId: question.recordId ?? '',
        questionId: question.id,
        question: question.question,
        answer: answerInput ?? '',
        tableId: tableId,
        answerType: question.metadata.answerMetadata.type,
        contextId: contextId,
      });
      setIsAnswerEdited(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerInput(e.target.value);
    setIsAnswerEdited(e.target.value !== latestAnswer);
  };

  useEffect(() => {
    setAnswerInput(latestAnswer);
  }, [latestAnswer]);

  return (
    <Flex flexDirection="column" gap="2" width="50%">
      <Text fontSize="lg" as="b">
        Svar
      </Text>
      <Stack spacing="2" direction="column">
        <Textarea
          value={answerInput}
          onChange={handleChange}
          background="white"
          resize="vertical"
        />
        <Button
          aria-label="Lagre svar"
          colorScheme="blue"
          leftIcon="check"
          variant="secondary"
          onClick={submitTextAnswer}
          isLoading={isLoading}
          isDisabled={!isAnswerEdited}
          width="fit-content"
        >
          Lagre svar
        </Button>
      </Stack>
    </Flex>
  );
}
