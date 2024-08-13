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

const FrontPage = () => {
  const {
    data: userinfo,
    isPending: isUserinfoLoading,
    isError: isUserinfoError,
  } = useFetchUserinfo();

  const teams = userinfo?.groups;
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
        <Heading size={'md'}>Noe gikk galt, prøv gjerne igjen</Heading>
      </Center>
    );
  }
  return (
    <Page gap={'4'} alignItems={'center'}>
      <VStack>
        <Heading textAlign={'left'} width={'100%'}>
          Dine team
        </Heading>
        <VStack
          align="start"
          divider={<StackDivider />}
          style={{ width: '40ch' }}
        >
          {teams?.map((team) => {
            return (
              <Link
                as={ReactRouterLink}
                to={`team/${team}`}
                key={team}
                colorScheme={'blue'}
              >
                {team}
              </Link>
            );
          })}
        </VStack>
      </VStack>
    </Page>
  );
};

export default FrontPage;
