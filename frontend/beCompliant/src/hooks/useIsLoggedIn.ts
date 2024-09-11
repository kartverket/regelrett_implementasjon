import { useQuery } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { API_URL_AUTH_STATUS, API_URL_LOGIN } from '../api/apiConfig';
import { useEffect, useState } from 'react';

type AuthStatus = {
  authenticated: boolean;
};

export const useIsLoggedIn = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (!isLoggedIn) {
      window.location.href = API_URL_LOGIN;
    }
  }, [isLoggedIn]);

  return useQuery({
    queryKey: ['isLoggedIn'],
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: () =>
      axiosFetch<AuthStatus>({ url: API_URL_AUTH_STATUS })
        .then((response) => {
          if (!response.data.authenticated) {
            setIsLoggedIn(false);
          }
        })
        .catch(() => setIsLoggedIn(false)),
  });
};
