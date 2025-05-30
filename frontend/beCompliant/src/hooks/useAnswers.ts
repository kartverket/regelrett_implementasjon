import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';
import { toast } from 'sonner';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

const url = (contextId: string, recordId?: string) =>
  `${API_URL_BASE}/answers?contextId=${contextId}${recordId ? `&recordId=${recordId}` : ''}`;

export function useAnswers(contextId?: string) {
  return useQuery({
    queryKey: ['answers', contextId],
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
    queryKey: ['answers', contextId, recordId],
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
  recordId?: string,
  refetchAll: boolean = false
) {
  const url = `${API_URL_BASE}/answer`;
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['answers', contextId, recordId],
    mutationFn: (body: SubmitAnswerRequest) => {
      return axiosFetch<SubmitAnswerRequest>({
        url: url,
        method: 'POST',
        data: JSON.stringify(body),
      });
    },
    onSuccess: async () => {
      if (!refetchAll && recordId) {
        await queryClient.invalidateQueries({
          queryKey: ['answers', contextId, recordId],
        });
      } else {
        await queryClient.invalidateQueries({
          queryKey: ['answers', contextId],
        });
      }
    },
    onError: () => {
      const toastId = 'submit-answer-error';
      toast.error('Å nei!', {
        description: 'Det har skjedd en feil. Prøv på nytt',
        duration: 5000,
        id: toastId,
      });
    },
  });
}
