import { useParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Heading, Text, Flex, RadioGroup, Radio, Stack } from '@kvib/react';
import { useFetchQuestion } from '../hooks/useFetchQuestion';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { formatDateTime } from '../utils/formatTime';
import { useFetchAnswersForQuestion } from '../hooks/useFetchAnswersForQuestion';
import { useFetchCommentsForQuestion } from '../hooks/useFetchCommentsForQuestion';
import { useSubmitAnswers } from '../hooks/useSubmitAnswers';

export const QuestionPage = () => {
  const { teamId, recordId } = useParams();
  const tableId = '570e9285-3228-4396-b82b-e9752e23cd73';

  const {
    data: question,
    error: questionError,
    isPending: questionIsLoading,
  } = useFetchQuestion(tableId, recordId);

  const {
    data: answers,
    error: answersError,
    isPending: answersIsLoading,
  } = useFetchAnswersForQuestion(teamId ?? '', recordId);

  const {
    data: comments,
    error: commentsError,
    isPending: commentsIsLoading,
  } = useFetchCommentsForQuestion(teamId ?? '', recordId);

  const { mutate: submitAnswer } = useSubmitAnswers(teamId);

  if (questionIsLoading || answersIsLoading || commentsIsLoading) {
    return <LoadingState />;
  }

  if (questionError || !question || answersError || commentsError) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  const handleSelectionAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAnswer: string = e.target.value;
    submitAnswer({
      actor: 'Unknown',
      recordId: recordId ?? '',
      questionId: question.id,
      question: question.question,
      answer: newAnswer,
      team: teamId,
      answerType: question.metadata.answerMetadata.type,
    });
  };

  const sikkerhetskontroller = question.metadata.optionalFields?.find(
    (field) => field.key == 'Sikkerhetskontroller'
  )?.value[0];

  return (
    <Page gap="4" alignItems="center">
      <Flex
        flexDirection="column"
        marginX="10"
        gap="2"
        width={{ base: '100%', md: '50%' }}
      >
        <Heading textAlign="left" width="100%" marginBottom="30px">
          Rediger
        </Heading>
        <Text fontSize="md">{question.id}</Text>
        <Text fontSize="lg" as="b">
          {sikkerhetskontroller}
        </Text>
        {question.updated && (
          <Text fontSize="lg">
            {'Sist endret ' + formatDateTime(question.updated)}
          </Text>
        )}
        <Text fontSize="lg" as="b">
          Svar
        </Text>
        <RadioGroup name="Svar" defaultValue={answers.at(-1)?.answer}>
          <Stack direction="column">
            {question.metadata.answerMetadata.options?.map((option) => (
              <Radio
                key={option}
                value={option}
                onChange={handleSelectionAnswer}
              >
                {option}
              </Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
    </Page>
  );
};
