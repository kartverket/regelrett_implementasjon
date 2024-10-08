import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { FriskMetadata } from '../api/types';

export function useFetchFriskFunctionMetadata(teamId?: string) {
  return useQuery({
    queryKey: apiConfig.friskMetadata.queryKey(teamId),
    queryFn: () =>
      axiosFetch<FriskMetadata[]>({
        url: apiConfig.friskMetadata.url(teamId),
      }).then((response) => response.data),
    enabled: !!teamId,
  });
}
