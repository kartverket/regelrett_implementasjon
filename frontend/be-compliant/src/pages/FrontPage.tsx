import { Center, Link, StackDivider, VStack } from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router-dom';

const FrontPage = () => {
  const teams = ['Team 1', 'Team 2', 'Team 3'];

  return (
    <Center>
      <VStack
        align="start"
        divider={<StackDivider />}
        style={{ width: '60ch' }}
      >
        {teams.map((team) => {
          return (
            <Link as={ReactRouterLink} to={`team/${team}`}>
              {team}
            </Link>
          );
        })}
      </VStack>
    </Center>
  );
};

export default FrontPage;
