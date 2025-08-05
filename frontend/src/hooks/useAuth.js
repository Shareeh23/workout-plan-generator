/* // hooks/useAuth.js
import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const checkAuthStatus = useCallback(() => {
    const token = localStorage.getItem('token');

    if (window.location.pathname.includes('/auth/callback')) {
      setIsLoading(false);
      return false;
    }

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      navigate('/login', { replace: true });
      return false;
    }

    setIsAuthenticated(true);
    setIsLoading(false);
    return true;
  }, [navigate]);

  useEffect(() => {
    checkAuthStatus();

    // Check auth status periodically (every 5 minutes)
    const interval = setInterval(() => {
      checkAuthStatus();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [checkAuthStatus]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsAuthenticated(false);
    navigate('/login', { replace: true });
  };

  return { isAuthenticated, isLoading, checkAuthStatus, logout };
};
 */