import { Center, Flex, Link, StackDivider, VStack } from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router-dom';

const FrontPage = () => {
  const teams = ['Team 1', 'Team 2', 'Team 3'];

  return (
    <>
      <Center style={{ padding: '16px' }}>
        <Flex direction="column" gap="16px">
          <h1 style={{ fontWeight: 600, fontSize: '1.5rem' }}>Dine team</h1>
          <VStack
            align="start"
            divider={<StackDivider />}
            style={{ width: '40ch' }}
          >
            {teams.map((team) => {
              return (
                <Link as={ReactRouterLink} to={`team/${team}`} key={team}>
                  {team}
                </Link>
              );
            })}
          </VStack>
        </Flex>
      </Center>
    </>
  );
};

export default FrontPage;
