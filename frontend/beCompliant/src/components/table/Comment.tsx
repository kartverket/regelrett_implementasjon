import { Flex, IconButton, Text, Textarea, useDisclosure } from '@kvib/react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useSubmitComment } from '../../hooks/useSubmitComment';
import { DeleteCommentModal } from './DeleteCommentModal';
import { LastUpdated } from './LastUpdated';
import { useKommentarCellState } from './TableState';

// Replace with type from api when the internal data model is implemented
type Props = {
  comment: string;
  questionId: string;
  updated?: Date;
  team: string | undefined;
};

export function Comment({ comment, questionId, updated, team }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const { setEditedComment, setIsEditing, editedComment, isEditMode } =
    useKommentarCellState(questionId);
  const [commentDeleted, setCommentDeleted] = useState(false);

  const {
    mutate: submitComment,
    isPending: isLoading,
    data,
  } = useSubmitComment(setIsEditing, team);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleCommentSubmit = () => {
    if (editedComment !== comment && editedComment != null) {
      submitComment({
        actor: 'Unknown',
        questionId: questionId,
        team: team,
        comment: editedComment ?? comment,
        updated: '',
      });
    }
  };

  const handleDiscardChanges = () => {
    setEditedComment(null);
    setIsEditing(false);
  };

  // set focus to text area when creating or editing comment
  useEffect(() => {
    if (isEditMode && textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }
  }, [isEditMode]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (textAreaRef.current !== document.activeElement) return;

    if (event.key === 'Escape') {
      handleDiscardChanges();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      handleCommentSubmit();
    }
  };

  if (isEditMode) {
    return (
      <Flex minWidth="200px" gap="2" justifyContent="space-between">
        <Textarea
          ref={textAreaRef}
          defaultValue={editedComment ?? comment}
          onChange={(e) => setEditedComment(e.target.value)}
          size="md"
          background="white"
          height="88px"
          onKeyDown={(ev) => {
            handleKeyDown(ev);
          }}
        />
        <Flex flexDirection="column" gap="2">
          <IconButton
            aria-label="Lagre kommentar"
            colorScheme="blue"
            icon="check"
            variant="primary"
            onClick={handleCommentSubmit}
            isLoading={isLoading}
            isDisabled={editedComment === comment}
          />
          <IconButton
            aria-label="Slett kommentar"
            colorScheme="red"
            icon="close"
            variant="primary"
            onClick={handleDiscardChanges}
            isLoading={isLoading}
          />
        </Flex>
      </Flex>
    );
  }

  // change this when the new data model is implemented. Because this should not be an empty string
  if ((comment === '' && data?.data.comment == null) || commentDeleted) {
    return (
      <IconButton
        aria-label="Legg til kommentar"
        colorScheme="blue"
        icon="add_comment"
        variant="secondary"
        onClick={() => setIsEditing(true)}
        background="white"
      />
    );
  }
  return (
    <>
      <Flex
        minWidth="200px"
        alignItems="center"
        gap="2"
        justifyContent="space-between"
      >
        <Text
          maxWidth="328px"
          overflow="hidden"
          whiteSpace="normal"
          fontSize="md"
        >
          {data?.data.comment ?? comment}
        </Text>
        <Flex flexDirection="column" gap="2">
          <IconButton
            aria-label="Rediger kommentar"
            colorScheme="blue"
            icon="edit"
            variant="secondary"
            onClick={() => setIsEditing(true)}
            background="white"
          />
          <IconButton
            aria-label="Slett kommentar"
            colorScheme="red"
            icon="delete"
            variant="secondary"
            onClick={onDeleteOpen}
            background="white"
          />
        </Flex>
      </Flex>
      {updated && <LastUpdated updated={updated} />}
      <DeleteCommentModal
        onOpen={onDeleteOpen}
        onClose={onDeleteClose}
        isOpen={isDeleteOpen}
        comment={comment}
        questionId={questionId}
        team={team}
        setEditMode={setIsEditing}
        setCommentDeleted={setCommentDeleted}
      />
    </>
  );
}
