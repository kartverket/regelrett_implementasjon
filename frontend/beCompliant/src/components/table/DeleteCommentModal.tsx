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
import { useDeleteComment } from '../../hooks/useDeleteComment';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  comment: string;
  questionId: string;
  team: string | undefined;
  setEditMode: (value: boolean) => void;
  setCommentDeleted: (deleted: boolean) => void;
};
export function DeleteCommentModal({
  onClose,
  isOpen,
  comment,
  questionId,
  team,
  setEditMode,
  setCommentDeleted,
}: Props) {
  const { mutateAsync: deleteComment, isPending: isLoading } = useDeleteComment(
    setEditMode,
    team
  );
  const handleCommentDelete = async () => {
    const result = await deleteComment({
      actor: 'Unknown',
      questionId: questionId,
      team: team,
      comment: comment,
      updated: new Date(),
    });
    if (result.status >= 200 && result.status < 300) {
      setCommentDeleted(true);
      setEditMode(false);
      onClose();
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Slett kommentar</ModalHeader>
        <ModalBody>
          <Stack>
            <Text size="sm">Er du sikker på at du vil slette kommentaren?</Text>
          </Stack>
        </ModalBody>
        <ModalFooter>
          <HStack justifyContent="end">
            <Button variant="tertiary" colorScheme="blue" onClick={onClose}>
              Avbryt
            </Button>
            <Button
              aria-label="Slett kommentar"
              variant="primary"
              colorScheme="red"
              leftIcon="delete"
              onClick={handleCommentDelete}
              isLoading={isLoading}
            >
              Slett kommentar
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
