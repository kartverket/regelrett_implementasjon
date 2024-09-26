import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { Answer } from '../api/types';
import { axiosFetch } from '../api/Fetch';

export function useFetchAnswers(team?: string) {
  const queryKeys = team
    ? apiConfig.answers.withTeam.queryKey(team)
    : apiConfig.answers.queryKey;
  const url = team
    ? apiConfig.answers.withTeam.url(team)
    : apiConfig.answers.url;

  return useQuery({
    queryKey: queryKeys,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    notifyOnChangeProps: ['data', 'error'],
    queryFn: () =>
      axiosFetch<Answer[]>({ url: url }).then((response) => response.data),
  });
}
