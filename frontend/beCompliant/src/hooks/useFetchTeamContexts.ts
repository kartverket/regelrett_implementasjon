import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';

export type Context = {
  id: string;
  name: string;
  teamId: string;
};

export function useFetchTeamContexts(teamId?: string) {
  return useQuery({
    queryKey: apiConfig.contextsForTeam.queryKey(teamId!),
    queryFn: () =>
      axiosFetch<Context[]>({
        url: apiConfig.contextsForTeam.url(teamId!),
      }).then((response) => response.data),
    enabled: !!teamId,
  });
}
