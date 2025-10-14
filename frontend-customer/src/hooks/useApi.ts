import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  showErrorToast?: boolean;
  retries?: number;
  retryDelay?: number;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  options: UseApiOptions = {}
) {
  const { showErrorToast = true, retries = 2, retryDelay = 1000 } = options;
  const { toast } = useToast();

  const [state, setState] = useState<ApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const data = await apiCall();
        setState({ data, loading: false, error: null });
        return data;
      } catch (error) {
        lastError = error as Error;
        console.warn(`API call failed (attempt ${attempt + 1}/${retries + 1}):`, error);

        if (attempt < retries) {
          // Wait before retrying
          await new Promise(resolve => setTimeout(resolve, retryDelay * Math.pow(2, attempt)));
        }
      }
    }

    // All retries failed
    const errorMessage = lastError?.message || 'An unexpected error occurred';
    setState({ data: null, loading: false, error: errorMessage });

    if (showErrorToast) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    }

    throw lastError;
  }, [apiCall, retries, retryDelay, showErrorToast, toast]);

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

// Hook for cached API calls with offline support
export function useCachedApi<T>(
  cacheKey: string,
  apiCall: () => Promise<T>,
  options: UseApiOptions & { cacheDuration?: number } = {}
) {
  const { cacheDuration = 5 * 60 * 1000, ...apiOptions } = options; // 5 minutes default

  const api = useApi(apiCall, apiOptions);

  const execute = useCallback(async () => {
    // Try to get from cache first
    try {
      const cached = localStorage.getItem(cacheKey);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < cacheDuration) {
          // Use cached data
          api.reset();
          return parsed.data;
        }
      }
    } catch (error) {
      console.warn('Error reading from cache:', error);
    }

    // Execute API call
    const data = await api.execute();

    // Cache the result
    try {
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now(),
      }));
    } catch (error) {
      console.warn('Error writing to cache:', error);
    }

    return data;
  }, [cacheKey, cacheDuration, api]);

  return {
    ...api,
    execute,
  };
}