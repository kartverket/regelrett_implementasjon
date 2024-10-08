import { useParams } from 'react-router-dom';
import { Flex, Button } from '@kvib/react';
import { useFetchQuestion } from '../hooks/useFetchQuestion';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { useFetchAnswersForQuestion } from '../hooks/useFetchAnswersForQuestion';
import { useFetchCommentsForQuestionByTeam } from '../hooks/useFetchCommentsForQuestion';
import { QuestionDetails } from '../components/questionPage/QuestionDetails';
import { QuestionAnswer } from '../components/questionPage/QuestionAnswer';

export const QuestionPage = () => {
  const { teamId, recordId, ...params } = useParams();
  const tableId = '570e9285-3228-4396-b82b-e9752e23cd73';

  const functionId = params.functionId
    ? Number.parseInt(params.functionId)
    : undefined;

  const {
    data: question,
    error: questionError,
    isPending: questionIsLoading,
  } = useFetchQuestion(tableId, recordId);

  const {
    data: answers,
    error: answersError,
    isPending: answersIsLoading,
  } = useFetchAnswersForQuestion(teamId, functionId, recordId);

  const {
    data: comments,
    error: commentsError,
    isPending: commentsIsLoading,
  } = useFetchCommentsForQuestionByTeam(teamId, functionId, recordId);

  if (questionIsLoading || answersIsLoading || commentsIsLoading) {
    return <LoadingState />;
  }

  if (questionError || answersError || commentsError) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  return (
    <Flex direction="column" marginTop="10">
      <Button
        variant="tertiary"
        leftIcon="arrow_back"
        colorScheme="blue"
        alignSelf="start"
        marginLeft="2"
        as="a"
        href={`/team/${teamId}`}
      >
        Tilbake
      </Button>
      <Flex
        alignSelf="center"
        flexDirection="column"
        gap="2"
        width={{ base: '100%', md: '40%' }}
      >
        <QuestionDetails
          question={question}
          answerUpdated={answers.at(-1)?.updated ?? new Date()}
          marginBottom="120px"
        />
        <QuestionAnswer
          question={question}
          answers={answers}
          team={teamId ?? ''}
          functionId={functionId}
        />
      </Flex>
    </Flex>
  );
};
