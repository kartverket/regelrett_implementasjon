import { useMutation } from '@tanstack/react-query';
import { axiosFetch } from '../api/Fetch';
import { API_URL_LOGOUT } from '../api/apiConfig';

export const useLogOut = () => {
  const url = API_URL_LOGOUT;

  return useMutation({
    mutationFn: () => axiosFetch({ url }),
    onSuccess: () => {
      window.location.href = '/';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
};
