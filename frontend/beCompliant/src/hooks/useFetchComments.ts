import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchComments(contextId?: string) {
  return useQuery({
    queryKey: apiConfig.comments.queryKey(contextId!),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.url(contextId!),
      }).then((response) => response.data),
    select: formatCommentData,
    enabled: !!contextId,
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
