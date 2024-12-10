import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  useToast,
} from '@kvib/react';
import { useFetchUserinfo } from '../../hooks/useFetchUserinfo';
import { useFetchContext } from '../../hooks/useFetchContext';
import { useParams } from 'react-router-dom';
import { apiConfig } from '../../api/apiConfig';
import { axiosFetch } from '../../api/Fetch';

type Props = {
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
};
export function SettingsModal({ onClose, isOpen }: Props) {
  const params = useParams();
  const contextId = params.contextId;
  const toast = useToast();

  const { data: userinfo } = useFetchUserinfo();
  const currentContext = useFetchContext(contextId);

  const handleChangeContextTeam = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (!contextId) return;
    const form = e.target as HTMLFormElement;
    const changeTeamElement = form.elements.namedItem(
      'edit_team'
    ) as HTMLSelectElement;
    if (!changeTeamElement?.value) {
      return;
    }
    const newTeamId = changeTeamElement.value;
    try {
      const response = await axiosFetch({
        url: apiConfig.contexts.forIdAndTeam.url(contextId, newTeamId),
        method: 'PATCH',
      });
      if (response.status === 200 || response.status === 204) {
        onClose();
      }
    } catch (error) {
      const toastId = 'change-context-team-error';
      if (!toast.isActive(toastId)) {
        toast({
          id: toastId,
          title: 'Å nei!',
          description: 'Det har skjedd en feil. Prøv på nytt',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Endre skjemautfylling</ModalHeader>
        <ModalBody>
          <form onSubmit={handleChangeContextTeam}>
            <Stack gap="1rem">
              <FormControl>
                <FormLabel>
                  Endre teamet dette skjemaet skal gjelde for:
                </FormLabel>
                <Select name="edit_team" placeholder="Velg team">
                  {userinfo?.groups.map((team) => {
                    if (team.id === currentContext.data?.teamId) {
                      return null;
                    }
                    return (
                      <option key={team.id} value={team.id}>
                        {team.displayName}
                      </option>
                    );
                  })}
                </Select>
              </FormControl>

              <HStack justifyContent="end">
                <Button
                  variant="secondary"
                  colorScheme="blue"
                  onClick={onClose}
                >
                  Avbryt
                </Button>

                <Button
                  aria-label="Endre team"
                  variant="primary"
                  colorScheme="blue"
                  type="submit"
                >
                  Lagre
                </Button>
              </HStack>
            </Stack>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
