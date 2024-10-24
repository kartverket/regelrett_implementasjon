import { Text, RadioGroup, Radio, Stack, Flex } from '@kvib/react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Question, User } from '../../api/types';

type Props = {
  question: Question;
  latestAnswer: string;
  contextId: string;
  user: User;
};

export function RadioAnswer({
  question,
  latestAnswer,
  contextId,
  user,
}: Props) {
  const { mutate: submitAnswer } = useSubmitAnswers(
    contextId,
    question.recordId
  );
  const { type: answerType, options } = question.metadata.answerMetadata;

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitAnswer({
      actor: user.id,
      recordId: question.recordId ?? '',
      questionId: question.id,
      answer: e.target.value,
      answerType: answerType,
      contextId: contextId,
    });
  };

  return (
    <Flex flexDirection="column" gap="2">
      <Text fontSize="lg" as="b">
        Svar
      </Text>
      <RadioGroup name="select-single-answer" defaultValue={latestAnswer}>
        <Stack direction="column">
          {options?.map((option) => (
            <Radio
              key={option}
              value={option}
              onChange={handleSelectionAnswer}
              colorScheme="blue"
            >
              {option}
            </Radio>
          ))}
        </Stack>
      </RadioGroup>
    </Flex>
  );
}
