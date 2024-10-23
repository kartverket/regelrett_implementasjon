import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestion(
  contextId?: string,
  recordId?: string
) {
  return useQuery({
    queryKey: apiConfig.comments.queryKey(contextId!, recordId!),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.url(contextId!, recordId!),
      }).then((response) => response.data),
    enabled: !!recordId && !!contextId,
  });
}
