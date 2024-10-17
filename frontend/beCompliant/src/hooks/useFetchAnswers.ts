import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswers(tableId?: string, contextId?: string) {
  const queryKeys = apiConfig.answers.queryKey(tableId!, contextId!);
  const url = apiConfig.answers.url(tableId!, contextId!);

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Answer[]>({ url: url }).then((response) => response.data),
    select: formatAnswerData,
    enabled: !!contextId && !!tableId,
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
