import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchComments(team?: string, functionId?: number) {
  return useQuery({
    queryKey: apiConfig.comments.withTeam.queryKey(team, functionId),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.withTeam.url(team, functionId),
      }).then((response) => response.data),
    select: formatCommentData,
    enabled: !!team || !!functionId,
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
