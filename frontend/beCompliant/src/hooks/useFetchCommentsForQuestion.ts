import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestion(questionId: string, team: string) {
  return useQuery({
    queryKey: apiConfig.commentsForQuestion.queryKey(questionId, team),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.commentsForQuestion.url(questionId, team),
      }).then((response) => response.data),
  });
}
