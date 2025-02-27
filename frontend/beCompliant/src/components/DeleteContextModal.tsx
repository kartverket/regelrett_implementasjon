import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@kvib/react';

import { useDeleteContext } from '../hooks/useContext';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  contextId: string;
  teamId: string;
};
export function DeleteContextModal({
  onClose,
  isOpen,
  contextId,
  teamId,
}: Props) {
  const { mutate: deleteContext, isPending: isLoading } = useDeleteContext(
    contextId,
    teamId,
    onClose
  );

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Slett skjemautfylling</ModalHeader>
        <ModalBody>
          <Stack>
            <Text size="sm">
              Er du sikker på at du vil slette skjemautfyllingen?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="end">
            <Button variant="tertiary" colorScheme="blue" onClick={onClose}>
              Avbryt
            </Button>
            <Button
              aria-label="Slett utfylling"
              variant="primary"
              colorScheme="red"
              leftIcon="delete"
              onClick={() => deleteContext()}
              isLoading={isLoading}
            >
              Slett skjemautfylling
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
