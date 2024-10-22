import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswersForQuestion(
  recordId?: string,
  contextId?: string
) {
  return useQuery({
    queryKey: apiConfig.answersForQuestion.queryKey(recordId!, contextId!),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answersForQuestion.url(recordId!, contextId!),
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
