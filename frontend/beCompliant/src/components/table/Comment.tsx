import { Button, Textarea } from '@kvib/react';
import { useState } from 'react';
import { useSubmitComment } from '../../hooks/useSubmitComment';

type CommentProps = {
  comment: string;
  questionId: string;
  team: string | undefined;
};

export function Comment({ comment, questionId, team }: CommentProps) {
  const [selectedComment, setComment] = useState<string | undefined>(comment);
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

  return (
    <>
      <Textarea
        marginBottom={2}
        marginTop={2}
        defaultValue={comment}
        onChange={handleCommentState}
        size="sm"
      />
      <Button
        colorScheme={'blue'}
        onClick={handleCommentSubmit}
        isLoading={isLoadingComment}
      >
        Lagre kommentar
      </Button>
    </>
  );
}
