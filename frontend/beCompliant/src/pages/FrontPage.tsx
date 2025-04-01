import {
  Center,
  Heading,
  Icon,
  VStack,
  Button,
  Skeleton,
  StackSeparator,
  toaster,
} from '@kvib/react';
import { Page } from '../components/layout/Page';
import { useUser } from '../hooks/useUser';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import RedirectBackButton from '../components/RedirectBackButton';
import TeamContexts from '../components/TeamContexts';

export default function FrontPage() {
  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useUser();

  if (isUserinfoError) {
    return (
      <>
        <RedirectBackButton />
        <Center height="70svh" flexDirection="column" gap="4">
          <Icon icon="error" size={64} weight={600} />
          <Heading size="md">Noe gikk galt, prøv gjerne igjen</Heading>
        </Center>
      </>
    );
  }

  const teams = userinfo ? userinfo.groups : [];

  if (!isUserinfoLoading && !teams.length) {
    return (
      <>
        <RedirectBackButton />
        <Center height="70svh" flexDirection="column" gap="4">
          <Icon icon="error" size={64} weight={600} />
          <Heading size="md">
            Vi fant dessverre ingen grupper som tilhører din bruker.
          </Heading>
        </Center>
      </>
    );
  }

  async function handleExportCSV() {
    try {
      const response = await axiosFetch<Blob>({
        url: apiConfig.dumpCSV.url,
        method: 'GET',
        responseType: 'blob',
      });

      if (!response.data) {
        throw new Error('No data received for CSV');
      }

      const blob = new Blob([response.data], {
        type: 'text/csv;charset=utf-8;',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.csv');

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading CSV:', error);
      const toastId = 'export-csv-error';
      if (!toaster.isVisible(toastId)) {
        toaster.create({
          id: toastId,
          title: 'Å nei!',
          description:
            'Det kan være du ikke har tilgang til denne funksjonaliteten:',
          type: 'error',
          duration: 5000,
        });
      }
    }
  }

  return (
    <>
      <RedirectBackButton />
      <Page alignItems="center">
        <VStack>
          <Heading
            fontSize="4xl"
            fontWeight="bold"
            textAlign="left"
            width="100%"
          >
            Dine team
          </Heading>
          <VStack align="start" separator={<StackSeparator />}>
            {userinfo?.superuser && (
              <Button
                padding="0"
                variant="tertiary"
                colorPalette="blue"
                onClick={() => handleExportCSV()}
                rightIcon="download"
              >
                Eksporter skjemautfyllinger
              </Button>
            )}
            <Skeleton loading={isUserinfoLoading} height="4em" width="100%">
              {teams.map((team) => {
                return (
                  <div key={team.id}>
                    <Heading size="2xl" fontWeight="bold" py="24px">
                      {team.displayName}
                    </Heading>
                    <TeamContexts teamId={team.id} />
                  </div>
                );
              })}
            </Skeleton>
          </VStack>
        </VStack>
      </Page>
    </>
  );
}
