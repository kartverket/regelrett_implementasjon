import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { Context } from './useFetchTeamContexts';
import { AxiosError } from 'axios';

export function useFetchContext(contextId?: string) {
  return useQuery<Context, AxiosError>({
    queryKey: apiConfig.contexts.byId.queryKey(contextId!),
    queryFn: () =>
      axiosFetch<Context>({
        url: apiConfig.contexts.byId.url(contextId!),
      }).then((response) => response.data),
    enabled: !!contextId,
  });
}
