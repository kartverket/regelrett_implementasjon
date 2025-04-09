import { Button, HStack, KvibDialog, Portal, Stack, Text } from '@kvib/react';
import { useDeleteComment } from '../hooks/useComments';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  recordId: string;
  contextId: string;
};
export function DeleteCommentModal({
  onClose,
  isOpen,
  recordId,
  contextId,
}: Props) {
  const { mutate: deleteComment, isPending: isLoading } = useDeleteComment(
    contextId,
    recordId,
    onClose
  );

  return (
    <KvibDialog.Root
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
      placement="center"
      open={isOpen}
    >
      <KvibDialog.Backdrop />
      <Portal>
        <KvibDialog.Positioner>
          <KvibDialog.Content>
            <KvibDialog.Header fontSize="xl">Slett kommentar</KvibDialog.Header>
            <KvibDialog.Body>
              <Stack>
                <Text textStyle="md">
                  Er du sikker på at du vil slette kommentaren?
                </Text>
              </Stack>
            </KvibDialog.Body>
            <KvibDialog.Footer>
              <HStack justifyContent="end">
                <Button
                  variant="tertiary"
                  colorPalette="blue"
                  onClick={onClose}
                >
                  Avbryt
                </Button>
                <Button
                  aria-label="Slett kommentar"
                  variant="primary"
                  colorPalette="red"
                  leftIcon="delete"
                  onClick={() => deleteComment()}
                  loading={isLoading}
                >
                  Slett kommentar
                </Button>
              </HStack>
            </KvibDialog.Footer>
          </KvibDialog.Content>
        </KvibDialog.Positioner>
      </Portal>
    </KvibDialog.Root>
  );
}
