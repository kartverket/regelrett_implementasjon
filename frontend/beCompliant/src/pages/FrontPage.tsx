import {
  Center,
  Heading,
  Icon,
  Link,
  Spinner,
  StackDivider,
  VStack,
  Text,
} from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useFetchTeamContexts } from '../hooks/useFetchTeamContexts';
import { useFetchContext } from '../hooks/useFetchContext';

const FrontPage = () => {
  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useFetchUserinfo();

  if (isUserinfoLoading) {
    return (
      <Center style={{ height: '100svh' }}>
        <Spinner size="xl" />
      </Center>
    );
  }
  if (isUserinfoError) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size="md">Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }

  const teams = userinfo ? userinfo.groups : [];
  if (!teams.length) {
    return (
      <Center height="70svh" flexDirection="column" gap="4">
        <Icon icon="error" size={64} weight={600} />
        <Heading size="md">
          Vi fant dessverre ingen grupper som tilhører din bruker.
        </Heading>
      </Center>
    );
  }
  return (
    <Page gap="4" alignItems="center">
      <VStack>
        <Heading textAlign="left" width="100%">
          Dine team
        </Heading>
        <VStack
          align="start"
          divider={<StackDivider />}
          style={{ width: '40ch' }}
        >
          {teams.map((team) => {
            return (
              <div key={team.id}>
                <Text>{team.displayName}</Text>
                <TeamContexts teamId={team.id} />
              </div>
            );
          })}
        </VStack>
      </VStack>
    </Page>
  );
};

function TeamContexts({ teamId }: { teamId: string }) {
  const { data: contexts, isPending: contextsIsPending } =
    useFetchTeamContexts(teamId);

  if (contextsIsPending) {
    return <Spinner size="xl" />;
  }

  return (
    <VStack alignItems="start" marginLeft={4}>
      {contexts?.map((context) => {
        return <ContextLink key={context.id} contextId={context.id} />;
      })}
    </VStack>
  );
}

function ContextLink({ contextId }: { contextId: string }) {
  const { data: context, isPending: contextIsPending } =
    useFetchContext(contextId);

  if (contextIsPending) {
    return <Spinner size="sm" />;
  }

  return (
    <Link to={`/context/${contextId}`} as={ReactRouterLink} colorScheme="blue">
      {context?.name}
    </Link>
  );
}

export default FrontPage;
