import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { apiConfig } from '../api/apiConfig';
import { AnswerType } from '../types/tableTypes';

export function useFetchAnswers(team?: string) {
  const queryKeys = team
    ? apiConfig.answers.withTeam.queryKey(team)
    : apiConfig.answers.queryKey;
  const url = team
    ? apiConfig.answers.withTeam.url(team)
    : apiConfig.answers.url;

  return useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      axiosFetch<AnswerType[]>({ url: url }).then((response) => response.data),
  });
}
