import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosFetch } from '../api/Fetch';

type AuthStatus = {
  authenticated: boolean;
};

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axiosFetch<AuthStatus>({
          url: 'http://localhost:8080/auth-status',
        });
        if (response.data.authenticated) {
          setIsAuthenticated(true);
        }
        if (!response.data.authenticated) {
          setIsAuthenticated(false);
          window.location.href = 'http://localhost:8080/login';
        }
      } catch (error) {
        setIsAuthenticated(false);
        window.location.href = 'http://localhost:8080/login';
      }
    };

    checkAuthStatus();
  }, [location, navigate]);

  return isAuthenticated;
};
