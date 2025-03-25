import {
  Text,
  Flex,
  RadioGroupRoot,
  RadioGroupItem,
  RadioGroupItemIndicator,
  RadioGroupItemText,
  RadioGroupItemHiddenInput,
  VStack,
} from '@kvib/react';
import { Question, User } from '../../api/types';
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

export function RadioAnswer({
  question,
  latestAnswer,
  contextId,
  user,
  lastUpdated,
  answerExpiry,
}: Props) {
  const { mutate: submitAnswer } = useSubmitAnswers(
    contextId,
    question.recordId
  );
  const { type: answerType, options } = question.metadata.answerMetadata;

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    submitRadioAnswer(e.target.value);
  };

  const submitRadioAnswer = (answer: string) => {
    submitAnswer({
      actor: user.id,
      recordId: question.recordId ?? '',
      questionId: question.id,
      answer: answer,
      answerType: answerType,
      contextId: contextId,
    });
  };

  return (
    <Flex flexDirection="column" gap="2">
      <Text fontSize="lg" fontWeight="bold">
        Svar
      </Text>
      <RadioGroupRoot
        orientation="vertical"
        name="select-single-answer"
        defaultValue={latestAnswer}
      >
        <VStack align="start">
          {options?.map((option) => (
            <RadioGroupItem
              key={option}
              value={option}
              onChange={handleSelectionAnswer}
              colorPalette="blue"
            >
              <RadioGroupItemHiddenInput />
              <RadioGroupItemIndicator />
              <RadioGroupItemText>{option}</RadioGroupItemText>
            </RadioGroupItem>
          ))}
        </VStack>
      </RadioGroupRoot>
      <LastUpdated
        updated={lastUpdated}
        answerExpiry={answerExpiry}
        submitAnswer={submitRadioAnswer}
        value={latestAnswer}
      />
    </Flex>
  );
}
