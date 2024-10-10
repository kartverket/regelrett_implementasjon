import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { FriskFunction } from '../api/types';

export function useFetchFriskFunction(functionId?: number) {
  return useQuery({
    queryKey: apiConfig.friskFunctions.queryKey(functionId),
    queryFn: () =>
      axiosFetch<FriskFunction>({
        url: apiConfig.friskFunctions.url(functionId),
      }).then((response) => response.data),
    enabled: !!functionId,
  });
}
