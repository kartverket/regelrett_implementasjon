import { useParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Center, Heading, Icon, Spinner, Text, Flex } from '@kvib/react';
import { useFetchQuestion } from '../hooks/useFetchQuestion';

const ErrorState = ({ message }: { message: string }) => (
  <Center height="70svh" flexDirection="column" gap="4">
    <Icon icon="error" size={64} weight={600} />
    <Heading size={'md'}>{message}</Heading>
  </Center>
);

export const QuestionPage = () => {
  const { teamName: team, recordId } = useParams();
  const tableId = '570e9285-3228-4396-b82b-e9752e23cd73';

  const {
    data: question,
    error,
    isPending,
  } = useFetchQuestion(tableId, recordId);

  if (isPending) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error || !question) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  return (
    <Page gap="4" alignItems="center">
      <Flex flexDirection="column" marginX="10" gap="2" width="40%">
        <Heading textAlign="left" width="100%" marginBottom="30px">
          Rediger
        </Heading>
        <Text fontSize="lg">{question.id}</Text>
      </Flex>
    </Page>
  );
};
