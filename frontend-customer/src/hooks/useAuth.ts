import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: {
    language: string;
    currency: string;
  };
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AUTH_STORAGE_KEY = 'auth_user';
const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Load user from storage on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const stored = localStorage.getItem(AUTH_STORAGE_KEY);
        if (stored) {
          const user = JSON.parse(stored);
          // Ensure preferences are present
          const userWithPreferences = {
            ...user,
            preferences: user.preferences || { language: 'en', currency: 'USD' }
          };
          setState({
            user: userWithPreferences,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    loadUser();
  }, []);

  const login = useCallback(async (data: LoginData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await response.json();
      const user: User = responseData.user;
      const token: string = responseData.token;

      // Store user with token in localStorage
      const userWithToken = {
        ...user,
        token,
        preferences: user.preferences || { language: 'en', currency: 'USD' }
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithToken));

      setState({
        user: userWithToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Login successful!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Login failed';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      toast.error(message);
      return false;
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<boolean> => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch(`${API_BASE}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Signup failed' }));
        throw new Error(errorData.message || 'Signup failed');
      }

      const responseData = await response.json();
      const user: User = responseData.user;
      const token: string = responseData.token;

      // Store user with token in localStorage
      const userWithToken = {
        ...user,
        token,
        preferences: user.preferences || { language: 'en', currency: 'USD' }
      };
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithToken));

      setState({
        user: userWithToken,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Signup failed';
      console.error('Signup error:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: message,
      }));
      toast.error(message);
      return false;
    }
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      await fetch(`${API_BASE}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout API error:', error);
    }

    // Clear local storage
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    toast.success('Logged out successfully');
  }, []);

  const checkAuth = useCallback(async (): Promise<void> => {
    setState(prev => ({ ...prev, isLoading: true }));

    try {
      // Get token from localStorage
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!storedUser) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      const token = parsedUser.token; // Assuming token is stored in user object

      if (!token) {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
        return;
      }

      const response = await fetch(`${API_BASE}/api/auth/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        credentials: 'include',
      });

      if (response.ok) {
        const user: User = await response.json();
        // Update user with preferences if not present
        const updatedUser = {
          ...user,
          preferences: user.preferences || { language: 'en', currency: 'USD' }
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
        setState({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
    } catch (error) {
      console.error('Check auth error:', error);
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  }, []);

  return {
    ...state,
    login,
    signup,
    logout,
    checkAuth,
  };
};