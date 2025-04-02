import {
  Skeleton,
  VStack,
  Text,
  useDisclosure,
  CardRoot,
  CardBody,
  Button,
  KvibProgressCircle,
  AbsoluteCenter,
  HStack,
} from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router';
import { useContext, useFetchTeamContexts } from '../hooks/useContext';
import { useFetchForms } from '../hooks/useFetchForms';
import { DeleteContextModal } from './DeleteContextModal';
import { Answer, Form } from '../api/types';
import { useFetchForm } from '../hooks/useFetchForm';
import { useAnswers } from '../hooks/useAnswers';
import { groupByField } from '../utils/mapperUtil';

export default function TeamContexts({ teamId }: { teamId: string }) {
  const { data: contexts = [], isPending: contextsIsPending } =
    useFetchTeamContexts(teamId);

  const { data: formsData, isPending: formsIsPending } = useFetchForms();

  if (!contextsIsPending && contexts.length === 0)
    return <Text>Dette teamet har ingen skjemautfyllinger</Text>;

  const uniqueFormIds = Array.from(
    new Set(contexts?.map((context) => context.formId))
  );

  const contextForms = formsData?.filter((form) =>
    uniqueFormIds.includes(form.id)
  );

  return (
    <Skeleton
      loading={contextsIsPending || formsIsPending}
      minH="40px"
      minW="200px"
    >
      <HStack alignItems="start" gap="24px">
        {contextForms?.map((form) => {
          const contextsForForm = contexts.filter(
            (context) => context.formId === form.id
          );

          return (
            <VStack alignItems="start" key={form.id} gap="16px">
              <Text fontSize="xl" fontWeight="bold">
                {form.name}
              </Text>
              <VStack alignItems="start" gap="16px">
                {contextsForForm.map((context) => (
                  <ContextLink
                    key={context.id}
                    contextId={context.id}
                    form={form}
                  />
                ))}
              </VStack>
            </VStack>
          );
        })}
      </HStack>
    </Skeleton>
  );
}

function ContextLink({ contextId, form }: { contextId: string; form: Form }) {
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { data: context, isPending: contextIsPending } = useContext(contextId);

  return (
    <>
      <Skeleton loading={contextIsPending}>
        <ReactRouterLink to={`/context/${contextId}`}>
          <CardRoot minW="450px" _hover={{ bg: 'gray.100', boxShadow: 'md' }}>
            <CardBody alignSelf="start" w="100%" p="16px">
              <HStack justifyContent="space-between">
                <VStack alignItems="start" gap="0">
                  <Text fontSize="lg" fontWeight="bold">
                    {context?.name}
                  </Text>
                  <Button
                    p="0"
                    aria-label="Slett utfylling"
                    colorPalette="red"
                    variant="tertiary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteOpen();
                    }}
                  >
                    Slett skjemautfyllingen
                  </Button>
                </VStack>
                <ProgressCircle contextId={contextId} form={form} />
              </HStack>
            </CardBody>
          </CardRoot>
        </ReactRouterLink>
      </Skeleton>
      <DeleteContextModal
        onOpen={onDeleteOpen}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        teamId={context?.teamId ?? ''}
        contextId={contextId}
      />
    </>
  );
}

function ProgressCircle({
  contextId,
  form,
}: {
  contextId: string;
  form: Form;
}) {
  const { data: formData, isPending: formIsPending } = useFetchForm(form.id);

  const { data: answers, isPending: answerIsPending } = useAnswers(contextId);

  const recordsWithAnswers = formData?.records.map((question) => ({
    ...question,
    answers:
      groupByField<Answer>(answers ?? [], 'questionId')[question.id] || [],
  }));

  const numberOfAnswers = recordsWithAnswers?.reduce((count, data) => {
    if (data.answers?.[0]?.answer && data.answers.at(-1)?.answer !== '') {
      count++;
    }
    return count;
  }, 0);

  const percentageAnswered = recordsWithAnswers?.length
    ? Math.round(((numberOfAnswers ?? 0) / recordsWithAnswers.length) * 100)
    : 0;

  return (
    <Skeleton loading={formIsPending || answerIsPending}>
      <KvibProgressCircle.Root
        value={isNaN(percentageAnswered) ? 0 : percentageAnswered}
        size="xl"
        colorPalette="blue"
      >
        <KvibProgressCircle.Circle>
          <KvibProgressCircle.Track />
          <KvibProgressCircle.Range strokeLinecap="round" />
        </KvibProgressCircle.Circle>
        <AbsoluteCenter>
          <KvibProgressCircle.Label>
            <Text fontWeight="bold">
              {numberOfAnswers}/{recordsWithAnswers?.length}
            </Text>
          </KvibProgressCircle.Label>
        </AbsoluteCenter>
      </KvibProgressCircle.Root>
    </Skeleton>
  );
}
