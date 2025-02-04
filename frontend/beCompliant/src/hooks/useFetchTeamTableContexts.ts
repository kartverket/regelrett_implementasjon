import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { Context } from './useFetchTeamContexts';

export function useFetchTeamTableContexts(teamId: string, formId: string) {
  return useQuery({
    queryKey: apiConfig.contexts.forTeamAndForm.queryKey(teamId, formId),
    queryFn: () =>
      axiosFetch<Context[]>({
        url: `${apiConfig.contexts.forTeamAndForm.url(teamId, formId)}`,
      }).then((response) => response.data),
    enabled: !!teamId && !!formId,
  });
}
