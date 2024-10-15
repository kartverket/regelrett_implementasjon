import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestionByTeam(
  team?: string,
  functionId?: number,
  tableId?: string,
  recordId?: string,
  contextId?: string
) {
  return useQuery({
    queryKey: apiConfig.commentsForQuestion.queryKey(
      tableId,
      team,
      functionId,
      recordId,
      contextId
    ),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.commentsForQuestion.url(
          tableId,
          team,
          functionId,
          recordId,
          contextId
        ),
      }).then((response) => response.data),
    enabled: recordId !== undefined && !!tableId,
  });
}
