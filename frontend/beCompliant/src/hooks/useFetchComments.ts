import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';
import { useQuery } from '@tanstack/react-query';


export const useFetchComments = (team?: string) => {
  const queryKeys = team ? apiConfig.comments.withTeam.queryKey(team) : apiConfig.comments.queryKey;
  const url = team ? apiConfig.comments.withTeam.url(team) : apiConfig.comments.url;


  return useQuery({
    queryKey: queryKeys,
    queryFn: () => axiosFetch<Comment[]>({ url: url }).then(response => response.data),
  });
};