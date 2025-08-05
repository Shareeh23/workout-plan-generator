const API_BASE = 'http://localhost:3000';
import axios from 'axios';

export const login = async (credentials) => {
  try {
    const response = await axios.put(`${API_BASE}/auth/login`, credentials, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      // Handle validation errors (422)
      if (error.response.status === 422 && error.response.data.data) {
        const validationErrors = error.response.data.data
          .map((err) => err.msg)
          .join(', ');
        throw new Error(validationErrors);
      }

      // Use backend error message or fallback
      const message =
        error.response.data?.message ||
        error.response.data?.error ||
        error.response.statusText ||
        'Login failed';
      throw new Error(message);
    } else {
      throw new Error('Network error - please try again');
    }
  }
};

export const signup = async (userData) => {
  try {
    const response = await fetch(`${API_BASE}/auth/signup/local`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
      credentials: 'include',
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle validation errors (422)
      if (response.status === 422 && data?.data) {
        const validationErrors = data.data.map((err) => err.msg).join(', ');
        throw new Error(validationErrors);
      }

      // Use backend error message or fallback
      const message =
        data?.message || data?.error || response.statusText || 'Signup failed';
      throw new Error(message);
    }

    return data;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const googleAuth = () => {
  sessionStorage.setItem('authSource', window.location.pathname);
  window.location.href = `${API_BASE}/auth/signup/google`;
};

// Handles token from URL after Google auth redirect
export const handleAuthRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  if (token) {
    // Clear token from URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return token;
  }
  return null;
};

export const fetchUserProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch(`${API_BASE}/auth/profile`, {
      method: 'GET',
      credentials: 'include', 
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    return data.user;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    if (error.message.includes('401') || error.message.includes('403')) {
      localStorage.removeItem('token');
    }
    return null;
  }
};
