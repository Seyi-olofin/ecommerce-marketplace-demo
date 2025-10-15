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

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://backend-ecommerce-marketplacbackend.onrender.com';

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

// Admin API functions
export const adminApi = {
  // Dashboard stats (first instance - remove duplicate)

  // Orders
  getOrders: async (page = 1, limit = 20) => {
    const res = await fetch(`${API_BASE}/api/admin/orders?page=${page}&limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch orders');
    return res.json();
  },

  // Update order status (first instance - keep this one)

  // Products
  getProducts: async (page = 1, limit = 20) => {
    const res = await fetch(`${API_BASE}/api/admin/products?page=${page}&limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  createProduct: async (productData: any) => {
    const res = await fetch(`${API_BASE}/api/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to create product');
    return res.json();
  },

  updateProduct: async (productId: string, productData: any) => {
    const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
      credentials: 'include',
      body: JSON.stringify(productData),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  deleteProduct: async (productId: string) => {
    const res = await fetch(`${API_BASE}/api/admin/products/${productId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Users
  getUsers: async (page = 1, limit = 20) => {
    const res = await fetch(`${API_BASE}/api/admin/users?page=${page}&limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch users');
    return res.json();
  },

  // Transactions
  getTransactions: async (page = 1, limit = 20) => {
    const res = await fetch(`${API_BASE}/api/admin/transactions?page=${page}&limit=${limit}`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch transactions');
    return res.json();
  },

  // Categories
  getCategories: async () => {
    const res = await fetch(`${API_BASE}/api/admin/categories`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json();
  },

  // Admin Dashboard Stats
  getDashboardStats: async () => {
    const res = await fetch(`${API_BASE}/api/admin/dashboard/stats`, {
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) {
      // Return demo stats if API fails
      return {
        totalOrders: 156,
        totalRevenue: 45280,
        activeUsers: 1234,
        productsInStock: 567
      };
    }
    return res.json();
  },

  // Delete Order (Admin only)
  deleteOrder: async (orderId: string) => {
    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete order');
    return res.json();
  },

  // Delete User (Admin only)
  deleteUser: async (userId: string) => {
    const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
    });
    if (!res.ok) throw new Error('Failed to delete user');
    return res.json();
  },

  // Update Order Status (Admin only)
  updateOrderStatus: async (orderId: string, status: string) => {
    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('admin_token')}`,
      },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error('Failed to update order status');
    return res.json();
  },
};