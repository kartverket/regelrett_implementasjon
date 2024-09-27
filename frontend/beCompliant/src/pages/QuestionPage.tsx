import { useParams } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Heading, Text, Flex, RadioGroup, Radio, Stack } from '@kvib/react';
import { useFetchQuestion } from '../hooks/useFetchQuestion';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { formatDateTime } from '../utils/formatTime';

export const QuestionPage = () => {
  const { teamName: team, recordId } = useParams();
  const tableId = '570e9285-3228-4396-b82b-e9752e23cd73';

  const {
    data: question,
    error,
    isPending: isLoading,
  } = useFetchQuestion(tableId, recordId);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error || !question) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  console.log('q', question);

  const sikkerhetskontroller = question.metadata.optionalFields?.find(
    (field) => field.key == 'Sikkerhetskontroller'
  )?.value[0];

  return (
    <Page gap="4" alignItems="center">
      <Flex flexDirection="column" marginX="10" gap="2" width="50%">
        <Heading textAlign="left" width="100%" marginBottom="30px">
          Rediger
        </Heading>
        <Text fontSize="md">{question.id}</Text>
        <Text fontSize="lg" as="b">
          {sikkerhetskontroller}
        </Text>
        <Text fontSize="lg">
          {'Sist endret ' + formatDateTime(question.updated ?? '')}
        </Text>
        <Text fontSize="lg" as="b">
          Svar
        </Text>
        <RadioGroup name="Svar">
          <Stack direction="column">
            {question.metadata.answerMetadata.options?.map((option) => (
              <Radio value={option}>{option}</Radio>
            ))}
          </Stack>
        </RadioGroup>
      </Flex>
    </Page>
  );
};
