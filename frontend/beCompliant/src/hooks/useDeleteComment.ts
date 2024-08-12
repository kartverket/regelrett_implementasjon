import { useToast } from '@kvib/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';

export function useDeleteComment() {
  const URL = apiConfig.comments.url;
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.comments.queryKey,
    mutationFn: (body: Comment) => {
      return axiosFetch({
        url: URL,
        method: 'DELETE',
        data: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      const toastId = 'delete-comment-success';
      if (!toast.isActive(toastId)) {
        toast({
          title: 'Suksess',
          description: 'Kommentaren din er slettet',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      return queryClient.invalidateQueries({
        queryKey: apiConfig.comments.queryKey,
      });
    },
    onError: () => {
      const toastId = 'delete-comment-error';
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
