import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestionByTeam(
  team?: string,
  functionId?: number,
  recordId?: string
) {
  return useQuery({
    queryKey: apiConfig.commentsForQuestion.queryKey(
      team,
      functionId,
      recordId
    ),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.commentsForQuestion.url(team, functionId, recordId),
      }).then((response) => response.data),
    enabled: recordId !== undefined,
  });
}
