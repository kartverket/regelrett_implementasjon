import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';
import { toaster } from '@kvib/react';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

const queryKey = (contextId: string, recordId?: string) => [
  'answers',
  contextId,
  recordId,
];

const url = (contextId: string, recordId?: string) =>
  `${API_URL_BASE}/answers?contextId=${contextId}${recordId ? `&recordId=${recordId}` : ''}`;

export function useAnswers(contextId?: string) {
  return useQuery({
    queryKey: queryKey(contextId!),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: url(contextId!),
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
    queryKey: queryKey(contextId!, recordId!),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: url(contextId!, recordId!),
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

export function useSubmitAnswer(
  contextId: string,
  recordId: string | undefined
) {
  const url = `${API_URL_BASE}/answer`;
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: SubmitAnswerRequest) => {
      return axiosFetch<SubmitAnswerRequest>({
        url: url,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: async () => {
      if (recordId != undefined) {
        await queryClient.invalidateQueries({
          queryKey: queryKey(contextId, recordId),
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: queryKey(contextId),
        });
      }
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
