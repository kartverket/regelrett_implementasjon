import {
  Center,
  Heading,
  Icon,
  Link,
  Spinner,
  StackDivider,
  VStack,
} from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { useFetchUserinfo } from '../hooks/useFetchUserinfo';
import { useFetchFriskFunction } from '../hooks/useFetchFriskFunction';
import { useFetchFriskFunctionMetadata } from '../hooks/useFetchFriskFunctionMetadata';

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
                <Link
                  as={ReactRouterLink}
                  to={`team/${team.id}`}
                  colorScheme="blue"
                  fontWeight="bold"
                >
                  {team.displayName}
                </Link>
                <TeamFunctions teamId={team.id} />
              </div>
            );
          })}
        </VStack>
      </VStack>
    </Page>
  );
};

function TeamFunctions({ teamId }: { teamId: string }) {
  const { data: functionMetadata, isPending: isFunctionMetadataLoading } =
    useFetchFriskFunctionMetadata(teamId);

  if (isFunctionMetadataLoading) {
    return <Spinner size="xl" />;
  }

  return (
    <VStack alignItems="start" marginLeft={4}>
      {functionMetadata?.map((functionMetadata) => {
        return (
          <FunctionLink
            key={functionMetadata.functionId}
            functionId={functionMetadata.functionId}
          />
        );
      })}
    </VStack>
  );
}

function FunctionLink({ functionId }: { functionId: number }) {
  const { data: func, isPending: isFunctionLoading } =
    useFetchFriskFunction(functionId);

  if (isFunctionLoading) {
    return <Spinner size="sm" />;
  }

  return (
    <Link
      to={`/function/${functionId}`}
      as={ReactRouterLink}
      colorScheme="blue"
    >
      {func?.name}
    </Link>
  );
}

export default FrontPage;
