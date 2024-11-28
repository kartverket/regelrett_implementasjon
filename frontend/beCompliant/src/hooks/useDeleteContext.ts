import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { useToast } from '@kvib/react';
import { axiosFetch } from '../api/Fetch';

export function useDeleteContext(
  contextId: string,
  teamId: string,
  onSuccess: () => void
) {
  const URL = apiConfig.contexts.byId.url(contextId);
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.contexts.byId.queryKey(contextId),
    mutationFn: () => {
      return axiosFetch({
        url: URL,
        method: 'DELETE',
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiConfig.contexts.forTeam.queryKey(teamId),
      });
      onSuccess();
    },
    onError: () => {
      const toastId = 'delete-context-error';
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
    },
  });
}
