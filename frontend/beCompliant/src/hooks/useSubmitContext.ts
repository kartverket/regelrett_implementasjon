import { useToast } from '@kvib/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';

type SubmitContextRequest = {
  teamId: string;
  name: string;
};

export function useSubmitContext() {
  const URL = apiConfig.contexts.url();
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.contexts.queryKey(),
    mutationFn: (body: SubmitContextRequest) => {
      return axiosFetch<SubmitContextRequest>({
        url: URL,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: async () => {
      const toastId = 'submit-context-success';
      if (!toast.isActive(toastId)) {
        toast({
          title: 'Suksess',
          description: 'Konteksten ble opprettet',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      await queryClient.invalidateQueries({
        queryKey: apiConfig.contexts.queryKey(),
      });
    },
    onError: () => {
      const toastId = 'submit-context-error';
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
