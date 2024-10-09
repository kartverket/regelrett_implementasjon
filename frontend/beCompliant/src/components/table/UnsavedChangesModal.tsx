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

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  onDiscard: () => void;
};

export function UnsavedChangesModal({ onClose, isOpen, onDiscard }: Props) {
  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Forkast endringer?</ModalHeader>
        <ModalBody>
          <Stack>
            <Text size="sm">
              Du er i ferd med å navigere deg vekk fra siden. Hvis du fortsetter
              vil endringene du har gjort bli forkastet. Vil du fortsette?
            </Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="end">
            <Button variant="tertiary" colorScheme="red" onClick={onDiscard}>
              Forkast
            </Button>
            <Button colorScheme="blue" onClick={onClose}>
              Avbryt
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
