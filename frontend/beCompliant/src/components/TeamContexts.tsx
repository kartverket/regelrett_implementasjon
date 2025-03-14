import {
  Skeleton,
  VStack,
  Text,
  useDisclosure,
  Flex,
  Link,
  IconButton,
} from '@kvib/react';
import { Link as ReactRouterLink } from 'react-router';
import { useContext, useFetchTeamContexts } from '../hooks/useContext';
import { useFetchForms } from '../hooks/useFetchForms';
import { DeleteContextModal } from './DeleteContextModal';

export default function TeamContexts({ teamId }: { teamId: string }) {
  const { data: contexts = [], isPending: contextsIsPending } =
    useFetchTeamContexts(teamId);

  const { data: tablesData, isPending: tablesIsPending } = useFetchForms();

  const uniqueTableIds = Array.from(
    new Set(contexts?.map((context) => context.formId))
  );

  const contextTables = tablesData?.filter((table) =>
    uniqueTableIds.includes(table.id)
  );

  return (
    <VStack alignItems="start" marginLeft={8}>
      <Skeleton
        isLoaded={!contextsIsPending && !tablesIsPending}
        minH="40px"
        minW="200px"
      >
        {contextTables?.map((table) => {
          const contextsForTable = contexts.filter(
            (context) => context.formId === table.id
          );

          return (
            <VStack alignItems="start" key={table.id}>
              <Text>{table.name}</Text>
              <VStack alignItems="start" pl={4}>
                {contextsForTable.map((context) => (
                  <ContextLink key={context.id} contextId={context.id} />
                ))}
              </VStack>
            </VStack>
          );
        })}
      </Skeleton>
    </VStack>
  );
}

function ContextLink({ contextId }: { contextId: string }) {
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const { data: context, isPending: contextIsPending } = useContext(contextId);

  return (
    <Flex alignItems="center" key={contextId}>
      <Skeleton isLoaded={!contextIsPending} fitContent>
        <Link
          to={`/context/${contextId}`}
          as={ReactRouterLink}
          colorScheme="blue"
        >
          {context?.name}
        </Link>
        <IconButton
          aria-label="Slett utfylling"
          colorScheme="red"
          variant="tertiary"
          icon="delete"
          onClick={() => onDeleteOpen()}
        />
      </Skeleton>
      <DeleteContextModal
        onOpen={onDeleteOpen}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        teamId={context?.teamId ?? ''}
        contextId={contextId}
      />
    </Flex>
  );
}
