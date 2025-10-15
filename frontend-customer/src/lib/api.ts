export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://ecommerce-marketplace-demo-7q65.vercel.app/api';

// Disable cart API calls for now to prevent 401 errors
const CART_DISABLED = true;
export const BACKEND_ORIGIN = API_BASE.replace(/\/api\/?$/i, '');

async function handleRes(res: Response) {
  if (!res.ok) {
    const txt = await res.text().catch(() => '');
    throw new Error(`API error ${res.status}: ${txt || res.statusText}`);
  }
  return res.json();
}

export async function getCategories() {
  const res = await fetch(`${API_BASE}/categories`, { credentials: 'include' });
  return handleRes(res);
}

import { getProductImage } from '@/services/imageService';

export async function getProducts(query = '') {
  try {
    const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
    const res = await fetch(url, { credentials: 'include' });

    if (res.ok) {
      const data = await res.json();
      const products = data.products || data; // Handle both paginated and direct responses

      // Use API images if available, otherwise enhance with Unsplash
      const enhancedProducts = await Promise.all(
        products.map(async (product: any) => ({
          ...product,
          thumbnail: product.thumbnail || product.images?.[0] || await getProductImage(product.category || 'general', product.title)
        }))
      );

      return enhancedProducts;
    }
  } catch (error) {
    console.log('API failed, using local products with real images');
  }

  // Fallback to local products with real images
  const response = await fetch('/data/products.json');
  const localProducts = await response.json();

  // Enhance local products with real Unsplash images
  const enhancedProducts = await Promise.all(
    localProducts.map(async (product: any) => ({
      ...product,
      thumbnail: await getProductImage(product.category, product.title),
      price: { amount: product.price.amount, currency: product.price.currency }
    }))
  );

  return enhancedProducts;
}

// Legacy compatibility exports
export const cachedApi = {
  getCategories,
  getProducts: async (query: string = '') => {
    const url = query ? `${API_BASE}/products?${query}` : `${API_BASE}/products`;
    const res = await fetch(url, { credentials: 'include' });
    return handleRes(res);
  },
  getFeaturedProducts: async (limit: number) => {
    const res = await fetch(`${API_BASE}/products/featured?limit=${limit}`, { credentials: 'include' });
    return handleRes(res);
  },
  getTopSellingProducts: async (limit: number) => {
    const res = await fetch(`${API_BASE}/products?sort=top-selling&limit=${limit}`, { credentials: 'include' });
    return handleRes(res);
  },
  getFlashSaleProducts: async (limit: number) => {
    const res = await fetch(`${API_BASE}/products?sort=flash-sale&limit=${limit}`, { credentials: 'include' });
    return handleRes(res);
  },
  getProductsByCategory: async (category: string) => {
    const res = await fetch(`${API_BASE}/products?category=${encodeURIComponent(category)}`, { credentials: 'include' });
    return handleRes(res);
  },
  getCart: async () => {
    if (CART_DISABLED) return { items: [] };
    const res = await fetch(`${API_BASE}/cart`, { credentials: 'include' });
    return handleRes(res);
  },
  addToCart: async (productId: string, quantity: number) => {
    if (CART_DISABLED) return { success: true };
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ productId, quantity })
    });
    return handleRes(res);
  },
  removeFromCart: async (id: string) => {
    if (CART_DISABLED) return { success: true };
    const res = await fetch(`${API_BASE}/cart/items/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleRes(res);
  },
  updateCartItem: async (id: string, quantity: number) => {
    if (CART_DISABLED) return { success: true };
    const res = await fetch(`${API_BASE}/cart/items/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ quantity })
    });
    return handleRes(res);
  },
  clearCart: async () => {
    if (CART_DISABLED) return { success: true };
    const res = await fetch(`${API_BASE}/cart`, {
      method: 'DELETE',
      credentials: 'include'
    });
    return handleRes(res);
  },
  createOrder: async (orderData: any) => {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(orderData)
    });
    return handleRes(res);
  },
  getOrders: async () => {
    const res = await fetch(`${API_BASE}/orders`, { credentials: 'include' });
    return handleRes(res);
  },
  getOrder: async (id: string) => {
    const res = await fetch(`${API_BASE}/orders/${id}`, { credentials: 'include' });
    return handleRes(res);
  },
  getMyOrders: async () => {
    const res = await fetch(`${API_BASE}/orders/my-orders`, { credentials: 'include' });
    return handleRes(res);
  },
  updateOrderStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status })
    });
    return handleRes(res);
  }
};

// Legacy function names
export const fetchCategories = getCategories;
export const fetchProducts = getProducts;
export const fetchProductDetails = async (id: string) => {
  const res = await fetch(`${API_BASE}/products/${id}`, { credentials: 'include' });
  return handleRes(res);
};

// Type definitions for compatibility
export interface Category {
  id: string;
  name: string;
  image?: string;
  description?: string;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  title: string;
  category?: string;
  description?: string;
  price: {
    amount: number;
    currency: string;
  };
  thumbnail?: string;
  rating?: number;
  source?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  product: Product;
}

export interface Cart {
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: string;
  createdAt: string;
}