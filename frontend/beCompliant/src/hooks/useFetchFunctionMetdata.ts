import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';

type FunctionMetadata = {
  id: number;
  functionId: number;
  key: string;
  value: string;
};

export const useFetchFunctionMetadata = (teamId: string) => {
  const queryKeys = apiConfig.functionMetadata.queryKey(teamId);
  const url = apiConfig.functionMetadata.url(teamId);

  return useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      axiosFetch<FunctionMetadata[]>({ url: url }).then(
        (response) => response.data
      ),
  });
};
