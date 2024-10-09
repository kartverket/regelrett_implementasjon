import {
  Divider,
  Flex,
  HStack,
  Icon,
  Text,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  Box,
  StepTitle,
  StepDescription,
  StepSeparator,
} from '@kvib/react';
import { Answer, Question } from '../../api/types';
import { formatDateTime } from '../../utils/formatTime';

type Props = {
  question: Question;
  answers: Answer[];
};

export function QuestionHistory({ question, answers }: Props) {
  const steps = answers.slice(-3).reverse();

  console.log(steps);

  return (
    <Flex flexDirection="column">
      <HStack marginBottom="2">
        <Icon icon="schedule" />
        <Text fontWeight="500">Historikk</Text>
      </HStack>
      <Divider borderColor="gray.400" marginBottom="4" />
      <HStack>
        <Stepper index={0} orientation="vertical">
          {steps.map((answer, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  active={
                    <Icon color="#156630" icon="circle" isFilled size={37} />
                  }
                />
              </StepIndicator>
              <Box flexShrink="0">
                <StepTitle>Endring svar</StepTitle>
                <StepDescription>
                  {formatDateTime(answer.updated)}
                </StepDescription>
              </Box>
              <StepSeparator />
            </Step>
          ))}
        </Stepper>
      </HStack>
    </Flex>
  );
}
