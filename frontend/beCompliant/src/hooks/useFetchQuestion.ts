import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Question } from '../api/types';

export function useFetchQuestion(tableId: string, recordId?: string) {
  return useQuery({
    queryKey: apiConfig.question.queryKey(recordId),
    queryFn: () =>
      axiosFetch<Question>({
        url: apiConfig.question.url(tableId, recordId),
      }).then((response) => response.data),
    enabled: recordId !== undefined,
  });
}
