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
  const [commentIsOpen, setCommentIsOpen] = useState<boolean>(comment !== '');
  const { mutate: submitComment, isPending: isLoadingComment } =
    useSubmitComment();

  const handleCommentSubmit = () => {
    if (selectedComment !== comment) {
      submitComment(
        {
          actor: 'Unknown',
          questionId: questionId,
          team: team,
          comment: selectedComment,
          updated: '',
        },
        { onSuccess: () => setCommentIsOpen(false) }
      );
    }
  };

  const handleCommentState = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(e.target.value);
  };

  return (
    <>
      <Button
        onClick={() => setCommentIsOpen(!commentIsOpen)}
        marginTop={2}
        size="xs"
        width="170px"
      >
        Kommentar
      </Button>
      {commentIsOpen && (
        <>
          <Textarea
            marginBottom={2}
            marginTop={2}
            defaultValue={comment}
            onChange={handleCommentState}
            size="sm"
          />
          <Button onClick={handleCommentSubmit} isLoading={isLoadingComment}>
            Lagre kommentar
          </Button>
        </>
      )}
    </>
  );
}
