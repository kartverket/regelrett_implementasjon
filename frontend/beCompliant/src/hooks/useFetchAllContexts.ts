import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { Context } from './useFetchTeamContexts';
import { useFetchUserinfo } from './useFetchUserinfo';

export function useFetchAllContexts() {
  const { data: userinfo } = useFetchUserinfo();
  const teams: string[] = userinfo?.groups.map((group) => group.id) ?? [];

  return useQuery({
    queryKey: ['allContexts'],
    queryFn: async () => {
      const promises: Promise<Context[]>[] = [];
      for (const team of teams) {
        promises.push(
          axiosFetch<Context[]>({
            url: apiConfig.contexts.forTeam.url(team),
          }).then((response) => response.data)
        );
      }
      return (await Promise.all(promises)).reduce((acc, val) => {
        return acc.concat(val);
      }, []);
    },
    enabled: !!teams.length,
  });
}
