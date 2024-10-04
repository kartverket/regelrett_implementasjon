import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { Column } from '../api/types';

export function useFetchColumns(tableId: string) {
  return useQuery({
    queryKey: apiConfig.columns.queryKey(),
    queryFn: () =>
      axiosFetch<Column[]>({
        url: apiConfig.columns.url(tableId),
      }).then((response) => response.data),
  });
}
