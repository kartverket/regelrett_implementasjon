import { Button, HStack, KvibDialog, Portal, Stack, Text } from '@kvib/react';

import { useDeleteContext } from '../hooks/useContext';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  contextId: string;
  teamId: string;
};
export function DeleteContextModal({
  onClose,
  isOpen,
  contextId,
  teamId,
}: Props) {
  const { mutate: deleteContext, isPending: isLoading } = useDeleteContext(
    contextId,
    teamId,
    onClose
  );

  return (
    <KvibDialog.Root
      lazyMount
      onOpenChange={(e) => {
        if (e.open) {
          onClose();
        }
      }}
      open={isOpen}
    >
      <KvibDialog.Backdrop />
      <Portal>
        <KvibDialog.Positioner>
          <KvibDialog.Content>
            <KvibDialog.Header fontSize="xl">
              Slett skjemautfylling
            </KvibDialog.Header>
            <KvibDialog.Body>
              <Stack>
                <Text textStyle="sm">
                  Er du sikker på at du vil slette skjemautfyllingen?
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
                  aria-label="Slett utfylling"
                  variant="primary"
                  colorPalette="red"
                  leftIcon="delete"
                  onClick={() => deleteContext()}
                  loading={isLoading}
                >
                  Slett skjemautfylling
                </Button>
              </HStack>
            </KvibDialog.Footer>
          </KvibDialog.Content>
        </KvibDialog.Positioner>
      </Portal>
    </KvibDialog.Root>
  );
}
