import { axiosFetch } from '../api/Fetch';
import { useQuery } from '@tanstack/react-query';
import { User } from '../api/types';

const API_URL_BASE = import.meta.env.VITE_BACKEND_URL;

type UserGroup = {
  id: string;
  displayName: string;
};

export type UserInfo = {
  groups: UserGroup[];
  user: User;
  superuser: boolean;
};

export const useUser = () => {
  return useQuery({
    queryKey: ['userinfo'],
    queryFn: () =>
      axiosFetch<UserInfo>({ url: `${API_URL_BASE}/userinfo` }).then(
        (response) => response.data
      ),
  });
};

export function useFetchUsername(userId: string) {
  return useQuery({
    queryKey: ['username', userId],
    queryFn: () =>
      axiosFetch<string>({
        url: `${API_URL_BASE}/userinfo/${userId}/username`,
      }).then((response) => response.data),
    enabled: userId !== undefined,
  });
}
