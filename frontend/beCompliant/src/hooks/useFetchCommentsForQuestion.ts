import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Comment } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchCommentsForQuestion(
  tableId?: string,
  recordId?: string,
  contextId?: string
) {
  return useQuery({
    queryKey: apiConfig.comments.queryKey(tableId!, recordId!, contextId!),
    queryFn: () =>
      axiosFetch<Comment[]>({
        url: apiConfig.comments.url(tableId!, recordId!, contextId!),
      }).then((response) => response.data),
    enabled: !!tableId && !!recordId && !!contextId,
  });
}
