import { useQuery } from '@tanstack/react-query';
import { apiConfig } from '../api/apiConfig';
import { axiosFetch } from '../api/Fetch';

type FunkregFunction = {
  id: number;
  path: string;
  parentId: number;
  name: string;
  description: string;
};

export const useFetchFunction = (functionId: number) => {
  const queryKeys = apiConfig.function.queryKey(functionId);
  const url = apiConfig.function.url(functionId);

  return useQuery({
    queryKey: queryKeys,
    queryFn: () =>
      axiosFetch<FunkregFunction>({ url: url }).then(
        (response) => response.data
      ),
  });
};
