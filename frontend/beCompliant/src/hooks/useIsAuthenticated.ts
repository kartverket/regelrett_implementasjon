import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { API_URL_LOGIN, apiConfig } from '../api/apiConfig';

type AuthStatus = {
  authenticated: boolean;
};

export const useIsAuthenticated = () => {
  return useQuery({
    queryKey: apiConfig.authStatus.queryKey,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: () =>
      axiosFetch<AuthStatus>({ url: apiConfig.authStatus.url })
        .then((response) => {
          if (!response.data.authenticated) {
            window.location.href = API_URL_LOGIN;
          }
          return response;
        })
        .catch(() => {
          window.location.href = API_URL_LOGIN;
        }),
  });
};
