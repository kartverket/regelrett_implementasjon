import {
  Flex,
  Text,
  Textarea,
  useDisclosure,
  Button as ButtonOld,
  FlexProps,
} from '@kvib/react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { DeleteCommentModal } from '../../components/DeleteCommentModal';
import { Question, User } from '../../api/types';
import { useSubmitComment } from '../../hooks/useComments';
import { Button } from '@/components/ui/button';
import { Trash2, Edit, Check, X, Loader2 } from 'lucide-react';

type Props = FlexProps & {
  question: Question;
  latestComment: string;
  contextId: string;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  user: User;
};

export function QuestionComment({
  question,
  latestComment,
  contextId,
  isEditing,
  setIsEditing,
  user,
  ...rest
}: Props) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const [editedComment, setEditedComment] = useState<string | null>(null);

  const { mutate: submitComment, isPending: isLoading } = useSubmitComment(
    contextId,
    question.recordId,
    setIsEditing
  );
  const {
    open: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  const handleCommentSubmit = () => {
    if (editedComment !== latestComment && editedComment != null) {
      submitComment({
        actor: user.id,
        recordId: question.recordId,
        questionId: question.id,
        comment: editedComment ?? latestComment,
        contextId: contextId,
      });
    }
  };

  const handleDiscardChanges = () => {
    setEditedComment(latestComment);
    setIsEditing(false);
  };

  // set focus to text area when creating or editing comment
  useEffect(() => {
    if (isEditing && textAreaRef.current) {
      const textArea = textAreaRef.current;
      textArea.focus();
      textArea.setSelectionRange(textArea.value.length, textArea.value.length);
    }
  }, [isEditing]);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (textAreaRef.current !== document.activeElement) return;

    if (event.key === 'Escape') {
      handleDiscardChanges();
    }
  };

  return (
    <div className="flex flex-col">
      <p className="font-bold text-lg pb-4">Kommentar</p>
      {isEditing ? (
        <div className="gap-4 flex-col">
          <Textarea
            ref={textAreaRef}
            defaultValue={editedComment ?? latestComment}
            onChange={(e) => setEditedComment(e.target.value)}
            colorPalette="blue"
            background="white"
            onKeyDown={(ev) => {
              handleKeyDown(ev);
            }}
          />
          <div className="flex flex-row gap-4">
            <Button
              aria-label="Lagre kommentar"
              variant="outline"
              onClick={handleCommentSubmit}
              disabled={editedComment === latestComment || isLoading}
            >
              {isLoading && <Loader2 className="animate-spin" />}
              {!isLoading && <Check className="text-primary size-5" />}
              <span className="text-primary">Lagre</span>
            </Button>
            <Button
              aria-label="Slett kommentar"
              variant="outline"
              onClick={handleDiscardChanges}
              className="border-destructive"
            >
              <X className="text-destructive size-5" />
              <span className="text-destructive">Avbryt</span>
            </Button>
          </div>
        </div>
      ) : latestComment === '' ? (
        <ButtonOld
          aria-label="Legg til kommentar"
          size="sm"
          variant="secondary"
          colorPalette="blue"
          leftIcon="add"
          onClick={() => setIsEditing(true)}
          w="fit-content"
        >
          Ny kommentar
        </ButtonOld>
      ) : (
        <>
          <Flex gap="4" flexDirection="column">
            <Text
              maxWidth="328px"
              overflow="hidden"
              whiteSpace="pre-wrap"
              fontSize="md"
            >
              {latestComment}
            </Text>
            <Flex gap="6">
              <Button
                aria-label="Rediger kommentar"
                variant="outline"
                onClick={() => {
                  setEditedComment(latestComment);
                  setIsEditing(true);
                }}
                className="flex justify-start border-primary"
              >
                <Edit className="size-5 text-primary" />
                <span className="text-primary">Rediger</span>
              </Button>
              <Button
                aria-label="Slett kommentar"
                variant="outline"
                onClick={onDeleteOpen}
                className="flex justify-start border-destructive"
              >
                <Trash2 className="size-5 text-destructive" />
                <span className="text-destructive">Slett</span>
              </Button>
            </Flex>
          </Flex>
          <DeleteCommentModal
            onOpen={onDeleteOpen}
            onClose={onDeleteClose}
            isOpen={isDeleteOpen}
            recordId={question.recordId}
            contextId={contextId}
          />
        </>
      )}
    </div>
  );
}
