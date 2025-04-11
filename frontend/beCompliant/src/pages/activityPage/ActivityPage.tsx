import { Flex, Heading, IconButton, Skeleton, Text } from '@kvib/react';
import { useParams } from 'react-router';
import { Page } from '../../components/layout/Page';
import { TableComponent } from './table/Table';
import { TableStatistics } from './TableStatistics';
import { useAnswers } from '../../hooks/useAnswers';
import { useComments } from '../../hooks/useComments';
import { useForm } from '../../hooks/useForm';
import { mapTableDataRecords } from '../../utils/mapperUtil';
import { AnswerType } from '../../api/types';
import { ErrorState } from '../../components/ErrorState';
import { useContext } from '../../hooks/useContext';
import { useUser } from '../../hooks/useUser';
import { useState } from 'react';
import { SettingsModal } from './settingsModal/SettingsModal';
import RedirectBackButton from '../../components/buttons/RedirectBackButton';
import { useQueryClient } from '@tanstack/react-query';

export default function ActivityPage() {
  const params = useParams();
  const contextId = params.contextId;
  const queryClient = useQueryClient();

  const {
    data: context,
    error: contextError,
    isPending: contextIsPending,
  } = useContext(contextId);

  const {
    data: userinfo,
    error: userinfoError,
    isPending: userinfoIsPending,
  } = useUser();

  const {
    data: tableData,
    error: tableError,
    isPending: tableIsPending,
  } = useForm(context?.formId);
  const {
    data: comments,
    error: commentError,
    isPending: commentIsPending,
  } = useComments(contextId);

  const {
    data: answers,
    error: answerError,
    isPending: answerIsPending,
  } = useAnswers(contextId);

  const [settingsOpen, setSettingsOpen] = useState(false);

  const error =
    tableError || commentError || answerError || contextError || userinfoError;

  if (contextError) {
    const statusCode = contextError.response?.status;
    if (statusCode === 401) {
      return (
        <ErrorState message="Du har ikke tilgang til denne skjemautfyllingen" />
      );
    } else if (statusCode === 404) {
      return (
        <ErrorState message="Denne skjemautfyllingen finnes ikke. Kanskje den er slettet?" />
      );
    }
  } else if (error) {
    return <ErrorState message="Noe gikk galt, prøv gjerne igjen" />;
  }

  if (tableData && comments && answers) {
    tableData.records = mapTableDataRecords(tableData, comments, answers);
  }

  const allSingleSelect = tableData?.records.every(
    (record) =>
      record.metadata?.answerMetadata?.type === AnswerType.SELECT_SINGLE
  );

  const teamName = userinfo?.groups.find(
    (team) => team.id === context?.teamId
  )?.displayName;

  return (
    <>
      <RedirectBackButton />
      <Page>
        <Flex flexDirection="column" maxW="100%" alignSelf="center" gap="4">
          <Flex flexDirection="column" gap="2" px="10">
            <Skeleton loading={contextIsPending || tableIsPending}>
              <Flex justifyContent="space-between">
                <Heading
                  size="4xl"
                  fontWeight="bold"
                >{`${context?.name} - ${tableData?.name}`}</Heading>
                <IconButton
                  variant="ghost"
                  icon="settings"
                  size="lg"
                  aria-label="Edit context"
                  colorPalette="blue"
                  onClick={() => setSettingsOpen(true)}
                />
              </Flex>
            </Skeleton>
            <Skeleton loading={contextIsPending || userinfoIsPending}>
              <Text fontSize="xl" fontWeight="600">
                Team: {teamName}{' '}
              </Text>
            </Skeleton>
            <Skeleton
              loading={tableIsPending || answerIsPending || commentIsPending}
            >
              <TableStatistics filteredData={tableData?.records ?? []} />
            </Skeleton>
          </Flex>
          <Skeleton
            loading={
              tableIsPending ||
              userinfoIsPending ||
              contextIsPending ||
              answerIsPending ||
              commentIsPending
            }
            minH="100vh"
            minW="60vw"
            w="auto"
          >
            {!!tableData &&
              !!context &&
              !!userinfo &&
              !!comments &&
              !!answers && (
                <TableComponent
                  tableMetadata={tableData?.columns ?? []}
                  filterByAnswer={allSingleSelect ?? false}
                  contextId={context?.id}
                  data={tableData?.records ?? []}
                  tableData={tableData}
                  user={userinfo.user}
                />
              )}
          </Skeleton>
          <SettingsModal
            setOpen={setSettingsOpen}
            open={settingsOpen}
            currentTeamName={teamName}
            onCopySuccess={() => queryClient.invalidateQueries()}
          />
        </Flex>
      </Page>
    </>
  );
}
