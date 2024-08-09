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
import { useSubmitComment } from '../../hooks/useSubmitComment';

type CommentProps = {
  comment: string;
  questionId: string;
  team: string | undefined;
};

export function Comment({ comment, questionId, team }: CommentProps) {
  const [selectedComment, setComment] = useState<string | undefined>(comment);
  const [editMode, setEditMode] = useState<boolean>(false);
  const { mutate: submitComment, isPending: isLoadingComment } =
    useSubmitComment();

  const handleCommentSubmit = () => {
    if (selectedComment !== comment) {
      submitComment({
        actor: 'Unknown',
        questionId: questionId,
        team: team,
        comment: selectedComment,
        updated: '',
      });
    }
  };

  const handleCommentState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  if (!editMode) {
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
            onClick={() => setComment('')}
          />
        </Stack>
      </HStack>
    );
  }

  return (
    <HStack minWidth="200px">
      <Textarea
        marginBottom={2}
        marginTop={2}
        defaultValue={comment}
        onChange={handleCommentState}
        size="sm"
      />
      <Spacer />
      <Stack>
        <IconButton
          aria-label="Rediger kommentar"
          colorScheme="blue"
          icon="check"
          variant="primary"
          onClick={handleCommentSubmit}
        />
        <IconButton
          aria-label="Slett kommentar"
          colorScheme="red"
          icon="delete"
          variant="primary"
          onClick={() => setComment('')}
        />
      </Stack>
    </HStack>
  );
}
