import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { Context } from './useFetchTeamContexts';

export function useFetchTeamTableContexts(teamId: string, tableId: string) {
  return useQuery({
    queryKey: apiConfig.contexts.forTeamAndTable.queryKey(teamId, tableId),
    queryFn: () =>
      axiosFetch<Context[]>({
        url: `${apiConfig.contexts.forTeamAndTable.url(teamId, tableId)}`,
      }).then((response) => response.data),
    enabled: !!teamId && !!tableId,
  });
}
