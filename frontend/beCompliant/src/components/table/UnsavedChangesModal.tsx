import { Button, KvibDialog, HStack, Stack, Text, Portal } from '@kvib/react';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  onDiscard: () => void;
};

export function UnsavedChangesModal({ onClose, isOpen, onDiscard }: Props) {
  return (
    <KvibDialog.Root
      onOpenChange={(e) => {
        if (!e.open) {
          onClose();
        }
      }}
      open={isOpen}
      placement="center"
    >
      <Portal>
        <KvibDialog.Positioner>
          <KvibDialog.Backdrop />
          <KvibDialog.Content>
            <KvibDialog.Header fontSize="xl">
              Forkast endringer?
            </KvibDialog.Header>
            <KvibDialog.Body>
              <Stack>
                <Text textStyle="sm">
                  Du er i ferd med å navigere deg vekk fra siden. Hvis du
                  fortsetter vil endringene du har gjort bli forkastet. Vil du
                  fortsette?
                </Text>
              </Stack>
            </KvibDialog.Body>
            <KvibDialog.Footer>
              <HStack justifyContent="end">
                <Button
                  variant="tertiary"
                  colorPalette="red"
                  onClick={onDiscard}
                >
                  Forkast
                </Button>
                <Button colorPalette="blue" onClick={onClose}>
                  Avbryt
                </Button>
              </HStack>
            </KvibDialog.Footer>
          </KvibDialog.Content>
        </KvibDialog.Positioner>
      </Portal>
    </KvibDialog.Root>
  );
}
