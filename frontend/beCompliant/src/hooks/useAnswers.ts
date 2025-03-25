import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';
import { toaster } from '@kvib/react';

export function useAnswers(contextId?: string) {
  return useQuery({
    queryKey: apiConfig.answers.queryKey(contextId!),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answers.url(contextId!),
      }).then((response) => response.data),
    select: formatAnswerData,
    enabled: !!contextId,
  });
}

function formatAnswerData(answers: Answer[]) {
  return answers.map((answer: Answer) => {
    return {
      ...answer,
      updated: new Date(answer.updated),
    };
  });
}

export function useFetchAnswersForQuestion(
  contextId?: string,
  recordId?: string
) {
  return useQuery({
    queryKey: apiConfig.answers.queryKey(contextId!, recordId!),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answers.url(contextId!, recordId!),
      }).then((response) => response.data),
    enabled: !!recordId && !!contextId,
    select: formatAnswerData,
  });
}

type SubmitAnswerRequest = {
  actor: string;
  recordId: string;
  questionId: string;
  answer: string;
  contextId: string;
  answerType: string;
  answerUnit?: string;
};

export function useSubmitAnswers(
  contextId: string,
  recordId: string | undefined
) {
  const URL = apiConfig.answer.url;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: apiConfig.answer.queryKey,
    mutationFn: (body: SubmitAnswerRequest) => {
      return axiosFetch<SubmitAnswerRequest>({
        url: URL,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: apiConfig.answers.queryKey(contextId, recordId),
      });
      await queryClient.invalidateQueries({
        queryKey: apiConfig.answers.queryKey(contextId),
      });
    },
    onError: () => {
      const toastId = 'submit-answer-error';
      if (!toaster.isVisible(toastId)) {
        toaster.create({
          title: 'Å nei!',
          description: 'Det har skjedd en feil. Prøv på nytt',
          type: 'error',
          duration: 5000,
        });
      }
    },
  });
}
