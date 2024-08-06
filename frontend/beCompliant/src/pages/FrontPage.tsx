import { Heading, Link, StackDivider, VStack } from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router-dom';
import { Page } from '../components/layout/Page';

const FrontPage = () => {
  const teams = ['Team 1', 'Team 2', 'Team 3'];

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
          {teams.map((team) => {
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
