import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestion(team: string, recordId?: string) {
  return useQuery({
    queryKey: apiConfig.commentsForQuestion.queryKey(team, recordId),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.commentsForQuestion.url(team, recordId),
      }).then((response) => response.data),
    enabled: recordId !== undefined,
  });
}
