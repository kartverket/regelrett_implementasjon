import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswersForQuestion(team: string, recordId?: string) {
  return useQuery({
    queryKey: apiConfig.answersForQuestion.queryKey(team, recordId),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answersForQuestion.url(team, recordId),
      }).then((response) => response.data),
    enabled: recordId !== undefined,
  });
}
