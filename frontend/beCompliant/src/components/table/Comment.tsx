import {
  Button,
  Center,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  Textarea,
  useDisclosure,
} from '@kvib/react';
import { useState } from 'react';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import { useSubmitComment } from '../../hooks/useSubmitComment';

type DeleteCommentModalProps = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  comment: string;
  questionId: string;
  team: string | undefined;
  setEditMode: (value: boolean) => void;
};
function DeleteCommentModal({
  onOpen,
  onClose,
  isOpen,
  comment,
  questionId,
  team,
  setEditMode,
}: DeleteCommentModalProps) {
  const { mutate: deleteComment, isPending: isLoading } =
    useDeleteComment(setEditMode);
  const handleCommentDelete = () => {
    deleteComment({
      actor: 'Unknown',
      questionId: questionId,
      team: team,
      comment: comment,
      updated: new Date(),
    });
    setEditMode(false);
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

// Replace with type from api when the internal data model is implemented
type CommentProps = {
  comment: string;
  questionId: string;
  team: string | undefined;
};

export function Comment({ comment, questionId, team }: CommentProps) {
  const [editedComment, setEditedComment] = useState<string | undefined>(
    comment
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const { mutate: submitComment, isPending: isLoading } =
    useSubmitComment(setEditMode);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleCommentSubmit = () => {
    if (editedComment !== comment) {
      submitComment({
        actor: 'Unknown',
        questionId: questionId,
        team: team,
        comment: editedComment,
        updated: '',
      });
    }
  };

  const handleEditedCommentState = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setEditedComment(e.target.value);
  };

  const handleDiscardChanges = () => {
    setEditedComment(comment);
    setEditMode(false);
  };

  if (editMode) {
    return (
      <HStack minWidth="200px">
        <Textarea
          marginBottom={2}
          marginTop={2}
          defaultValue={editedComment}
          onChange={handleEditedCommentState}
          size="sm"
        />
        <Spacer />
        <Stack>
          <IconButton
            aria-label="Lagre kommentar"
            colorScheme="blue"
            icon="check"
            variant="primary"
            onClick={handleCommentSubmit}
            isLoading={isLoading}
          />
          <IconButton
            aria-label="Slett kommentar"
            colorScheme="red"
            icon="close"
            variant="primary"
            onClick={handleDiscardChanges}
            isLoading={isLoading}
          />
        </Stack>
      </HStack>
    );
  }

  // change this when the new data model is implemented. Because this should not be an empty string
  if (comment === '') {
    return (
      <Center>
        <IconButton
          aria-label="Legg til kommentar"
          colorScheme="blue"
          icon="add_comment"
          variant="secondary"
          onClick={() => setEditMode(true)}
        />
      </Center>
    );
  }
  return (
    <>
      <HStack minWidth="200px">
        <Text size="sm">{comment}</Text>
        <Spacer />
        <Stack>
          <IconButton
            aria-label="Rediger kommentar"
            colorScheme="blue"
            icon="edit"
            variant="secondary"
            onClick={() => setEditMode(true)}
          />
          <IconButton
            aria-label="Slett kommentar"
            colorScheme="red"
            icon="delete"
            variant="secondary"
            onClick={onDeleteOpen}
          />
        </Stack>
      </HStack>
      <DeleteCommentModal
        onOpen={onDeleteOpen}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        comment={comment}
        questionId={questionId}
        team={team}
        setEditMode={setEditMode}
      />
    </>
  );
}
