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
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

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
    if (statusCode === 403) {
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
        <div className="flex flex-col max-w-full self-center gap-4">
          <div className="flex flex-col gap-2 px-10">
            <SkeletonLoader
              loading={contextIsPending || tableIsPending}
              width="w-full"
              height="h-8"
            >
              <div className="flex justify-between">
                <h3 className="text-2xl font-bold">{`${context?.name} - ${tableData?.name}`}</h3>
                <Button
                  variant="ghost"
                  size="lg"
                  aria-label="Edit context"
                  onClick={() => setSettingsOpen(true)}
                  className="text-primary hover:text-primary"
                >
                  <Settings className="size-5" />
                </Button>
              </div>
            </SkeletonLoader>
            <SkeletonLoader
              loading={contextIsPending || userinfoIsPending}
              width="w-full"
              height="h-8"
            >
              <p className="text-lg font-semibold"> Team: {teamName} </p>
            </SkeletonLoader>
            <SkeletonLoader
              loading={tableIsPending || answerIsPending || commentIsPending}
              width="w-full"
              height="h-6"
            >
              <TableStatistics filteredData={tableData?.records ?? []} />
            </SkeletonLoader>
          </div>
          <SkeletonLoader
            loading={
              tableIsPending ||
              userinfoIsPending ||
              contextIsPending ||
              answerIsPending ||
              commentIsPending
            }
            width="w-full"
            height="min-h-[100vh]"
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
          </SkeletonLoader>
          <SettingsModal
            setOpen={setSettingsOpen}
            open={settingsOpen}
            currentTeamName={teamName}
            onCopySuccess={() => queryClient.invalidateQueries()}
          />
        </div>
      </Page>
    </>
  );
}
