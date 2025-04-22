import {
  Center,
  Heading,
  Icon,
  VStack,
  Button,
  Skeleton,
  StackSeparator,
} from '@kvib/react';
import { Page } from '../../components/layout/Page';
import { useUser } from '../../hooks/useUser';
import RedirectBackButton from '../../components/buttons/RedirectBackButton';
import TeamContexts from './TeamContexts';
import { handleExportCSV } from '../../utils/csvExportUtils';

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

  return (
    <>
      <RedirectBackButton />
      <Page>
        <VStack
          inset="0"
          marginInline="auto"
          paddingInline="8"
          alignItems="start"
        >
          <Heading fontSize="4xl" fontWeight="bold">
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
            <Skeleton loading={isUserinfoLoading}>
              {teams.map((team) => {
                return (
                  <div key={team.id}>
                    <Heading
                      size="2xl"
                      fontWeight="bold"
                      paddingBlock="4"
                      width="fit-content"
                    >
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
