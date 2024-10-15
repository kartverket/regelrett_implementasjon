import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchComments(
  team?: string,
  functionId?: number,
  tableId?: string,
  contextId?: string
) {
  return useQuery({
    queryKey: apiConfig.comments.withTeam.queryKey(
      team,
      functionId,
      tableId,
      contextId
    ),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.withTeam.url(
          tableId,
          team,
          functionId,
          contextId
        ),
      }).then((response) => response.data),
    select: formatCommentData,
    enabled: (!!team || !!functionId || !!contextId) && !!tableId,
  });
}

function formatCommentData(comments: Comment[]) {
  return comments.map((comment: Comment) => {
    return {
      ...comment,
      updated: new Date(comment.updated),
    };
  });
}
