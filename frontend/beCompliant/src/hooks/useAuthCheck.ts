import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosFetch } from '../api/Fetch';
import useBackendUrl from './backendUrl';

type AuthStatus = {
  authenticated: boolean;
};

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const loginUrl = useBackendUrl('/login');
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
          window.location.href = loginUrl;
        }
      } catch (error) {
        setIsAuthenticated(false);
        window.location.href = loginUrl;
      }
    };

    checkAuthStatus();
  }, [location, navigate]);

  return isAuthenticated;
};
