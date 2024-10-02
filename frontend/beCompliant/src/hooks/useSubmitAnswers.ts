import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { useToast } from '@kvib/react';

type SubmitAnswerRequest = {
  actor: 'Unknown';
  recordId: string;
  questionId: string;
  question: string;
  answer: string;
  updated: string;
  team?: string;
  answerType: string;
  answerUnit?: string;
};

export function useSubmitAnswers(team?: string) {
  const URL = apiConfig.answer.url;
  const queryClient = useQueryClient();
  const toast = useToast();

  return useMutation({
    mutationKey: apiConfig.answer.queryKey,
    mutationFn: (body: SubmitAnswerRequest) => {
      return axiosFetch<SubmitAnswerRequest>({
        url: URL,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      const toastId = 'submit-answer-success';
      if (!toast.isActive(toastId)) {
        toast({
          title: 'Suksess',
          description: 'Svaret ditt er lagret',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      queryClient.refetchQueries({
        queryKey: [
          team
            ? apiConfig.answers.withTeam.queryKey(team)
            : apiConfig.answers.queryKey,
        ],
      });
      return queryClient.invalidateQueries({
        queryKey: apiConfig.answers.queryKey,
      });
    },
    onError: () => {
      const toastId = 'submit-answer-error';
      if (!toast.isActive(toastId)) {
        toast({
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
