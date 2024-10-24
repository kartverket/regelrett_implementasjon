import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

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

function formatAnswerData(answers: Answer[]) {
  return answers.map((answer: Answer) => {
    return {
      ...answer,
      updated: new Date(answer.updated),
    };
  });
}
