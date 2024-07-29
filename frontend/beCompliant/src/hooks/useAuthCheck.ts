import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { axiosFetch } from '../api/Fetch';
import useBackendUrl from './backendUrl';

type AuthStatus = {
  authenticated: boolean;
};

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();
  const authStatusUrl = useBackendUrl('/auth-status');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosFetch<AuthStatus>({
          url: authStatusUrl,
        });
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        }
        if (!response.data.authenticated) {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuthStatus();
  }, [location]);

  return isAuthenticated;
};
