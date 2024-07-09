import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { AnswerType } from '../components/answer/Answer';
import { apiConfig } from '../api/apiConfig';

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
