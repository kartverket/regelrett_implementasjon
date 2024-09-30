import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswersForQuestion(questionId: string, team: string) {
  return useQuery({
    queryKey: apiConfig.answersForQuestion.queryKey(questionId, team),
    queryFn: () =>
      axiosFetch<Answer[]>({
        url: apiConfig.answersForQuestion.url(questionId, team),
      }).then((response) => response.data),
  });
}
