import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswersForQuestion(
  tableId?: string,
  recordId?: string,
  contextId?: string
) {
  return useQuery({
    queryKey: apiConfig.answersForQuestion.queryKey(
      tableId!,
      recordId!,
      contextId!
    ),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answersForQuestion.url(tableId!, recordId!, contextId!),
      }).then((response) => response.data),
    enabled: !!tableId && !!recordId && !!contextId,
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
