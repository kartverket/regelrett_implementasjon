import {
  Flex,
  IconButton,
  Text,
  Textarea,
  useDisclosure,
  Stack,
} from '@kvib/react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useSubmitComment } from '../../hooks/useSubmitComment';
import { DeleteCommentModal } from './DeleteCommentModal';
import { formatDateTime } from '../../utils/formatTime';
import { LastUpdated } from './LastUpdated';

// Replace with type from api when the internal data model is implemented
type Props = {
  comment: string;
  questionId: string;
  updated?: Date;
  team: string | undefined;
};

export function Comment({ comment, questionId, updated, team }: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editedComment, setEditedComment] = useState<string | undefined>(
    comment
  );
  const [submittedComment, setSubmittedComment] = useState<
    string | undefined
  >();
  const [commentDeleted, setCommentDeleted] = useState(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const {
    mutate: submitComment,
    isPending: isLoading,
    data,
  } = useSubmitComment(setEditMode);
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

  useEffect(() => {
    if (data?.data) {
      setSubmittedComment(data.data.comment);
    }
  }, [data]);

  const handleDiscardChanges = () => {
    setEditedComment(comment);
    setEditMode(false);
  };

  // set focus to text area when creating or editing comment
  useEffect(() => {
    if (editMode && textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }
  }, [editMode]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (textAreaRef.current !== document.activeElement) return;

    if (event.key === 'Escape') {
      handleDiscardChanges();
    }

    if (event.key === 'Enter' && event.shiftKey) {
      handleCommentSubmit();
    }
  };

  if (editMode) {
    return (
      <Flex minWidth="200px" gap="2" justifyContent="space-between">
        <Textarea
          ref={textAreaRef}
          defaultValue={editedComment}
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
  if ((comment === '' && !submittedComment) || commentDeleted) {
    return (
      <IconButton
        aria-label="Legg til kommentar"
        colorScheme="blue"
        icon="add_comment"
        variant="secondary"
        onClick={() => setEditMode(true)}
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
          {submittedComment ?? comment}
        </Text>
        <Flex flexDirection="column" gap="2">
          <IconButton
            aria-label="Rediger kommentar"
            colorScheme="blue"
            icon="edit"
            variant="secondary"
            onClick={() => setEditMode(true)}
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
        setEditMode={setEditMode}
        setCommentDeleted={setCommentDeleted}
      />
    </>
  );
}
