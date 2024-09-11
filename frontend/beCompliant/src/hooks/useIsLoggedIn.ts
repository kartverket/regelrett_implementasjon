import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { API_URL_AUTH_STATUS, API_URL_LOGIN } from '../api/apiConfig';

type AuthStatus = {
  authenticated: boolean;
};

export const useIsLoggedIn = () => {
  return useQuery({
    queryKey: ['isLoggedIn'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: () =>
      axiosFetch<AuthStatus>({ url: API_URL_AUTH_STATUS })
        .then((response) => {
          if (!response.data.authenticated) {
            window.location.href = API_URL_LOGIN;
          }
        })
        .catch(() => {
          window.location.href = API_URL_LOGIN;
        }),
  });
};
