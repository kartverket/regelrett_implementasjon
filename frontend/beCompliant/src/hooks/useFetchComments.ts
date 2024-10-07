import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchComments(team: string) {
  return useQuery({
    queryKey: apiConfig.comments.withTeam.queryKey(team),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.withTeam.url(team),
      }).then((response) => response.data),
    select: formatCommentData,
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
