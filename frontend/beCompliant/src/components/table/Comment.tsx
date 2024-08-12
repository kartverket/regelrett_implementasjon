import {
  Center,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  Textarea,
} from '@kvib/react';
import { useState } from 'react';
import { useDeleteComment } from '../../hooks/useDeleteComment';
import { useSubmitComment } from '../../hooks/useSubmitComment';

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
  const { mutate: submitComment } = useSubmitComment();
  const { mutate: deleteComment } = useDeleteComment();

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
    setEditMode(false);
  };

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
          />
          <IconButton
            aria-label="Slett kommentar"
            colorScheme="red"
            icon="close"
            variant="primary"
            onClick={handleDiscardChanges}
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
          onClick={handleCommentDelete}
        />
      </Stack>
    </HStack>
  );
}
