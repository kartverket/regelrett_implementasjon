import { Text, RadioGroup, Radio, Stack, Flex } from '@kvib/react';
import { useSubmitAnswers } from '../../hooks/useSubmitAnswers';
import { Question } from '../../api/types';

type Props = {
  question: Question;
  latestAnswer: string;
  team: string;
};

export function RadioAnswer({ question, latestAnswer, team }: Props) {
  const { mutate: submitAnswer } = useSubmitAnswers(team);
  const { type: answerType, options } = question.metadata.answerMetadata;

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitAnswer({
      actor: 'Unknown',
      recordId: question.recordId ?? '',
      questionId: question.id,
      question: question.question,
      answer: e.target.value,
      team: team,
      answerType: answerType,
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
