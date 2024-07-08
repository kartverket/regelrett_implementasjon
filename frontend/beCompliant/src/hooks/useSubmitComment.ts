import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { useToast } from '@kvib/react';

type SubmitCommentsRequest = {
  actor: string;
  questionId: string;
  team?: string;
  comment?: string;
  updated: string;
};

export function useSubmitComment() {
  const URL = apiConfig.comments.url;
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.comments.queryKey,
    mutationFn: (body: SubmitCommentsRequest) => {
      return axiosFetch({
        url: URL,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      toast({
        title: 'Suksess',
        description: 'Kommentaren din er lagret',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      return queryClient.invalidateQueries({
        queryKey: apiConfig.comments.queryKey,
      });
    },
    onError: () => {
      toast({
        title: 'Å nei!',
        description: 'Det har skjedd en feil. Prøv på nytt',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });
}
