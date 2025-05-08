import {
  Button,
  CardBody,
  CardRoot,
  HStack,
  Skeleton,
  Text,
  Tooltip,
  useDisclosure,
  VStack,
} from '@kvib/react';
import { useContext } from '@/hooks/useContext';
import { Link as ReactRouterLink } from 'react-router';
import { ActiveFilter } from '@/types/tableTypes';
import { DeleteContextModal } from '@/pages/frontPage/DeleteContextModal';
import { ProgressCircle } from '@/pages/frontPage/ProgressCircle';

export function ContextLink({
  contextId,
  formId,
}: {
  contextId: string;
  formId: string;
}) {
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  function TruncatedText({
    str,
    maxLength,
  }: {
    str: string;
    maxLength: number;
  }) {
    if (str.length > maxLength) {
      return (
        <Tooltip content={str}>
          <Text fontSize="lg" fontWeight="bold">
            {str.slice(0, maxLength)}...
          </Text>
        </Tooltip>
      );
    } else {
      return (
        <Text fontSize="lg" fontWeight="bold">
          {str}
        </Text>
      );
    }
  }

  const { data: context, isPending: contextIsPending } = useContext(contextId);

  return (
    <Skeleton loading={contextIsPending}>
      {context && (
        <ReactRouterLink
          to={`/context/${contextId}?${JSON.parse(
            localStorage.getItem(`filters_${context.formId}`) || `[]`
          )
            .map(
              (filter: ActiveFilter) => `filter=${filter.id}_${filter.value}`
            )
            .join('&')}`}
        >
          <CardRoot
            minWidth="450px"
            _hover={{ bg: 'gray.100', boxShadow: 'md' }}
          >
            <CardBody alignSelf="start" width="100%" padding="16px">
              <HStack justifyContent="space-between">
                <VStack alignItems="start" gap="0">
                  <TruncatedText str={context?.name ?? ''} maxLength={27} />
                  <Button
                    p="0"
                    aria-label="Slett utfylling"
                    colorPalette="red"
                    variant="tertiary"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      onDeleteOpen();
                    }}
                  >
                    Slett skjemautfyllingen
                  </Button>
                </VStack>
                <ProgressCircle contextId={contextId} formId={formId} />
              </HStack>
            </CardBody>
          </CardRoot>
        </ReactRouterLink>
      )}
      <DeleteContextModal
        onOpen={onDeleteOpen}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        teamId={context?.teamId ?? ''}
        contextId={contextId}
      />
    </Skeleton>
  );
}
