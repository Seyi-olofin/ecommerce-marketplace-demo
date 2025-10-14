import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { cachedApi, Cart, CartItem } from '@/lib/api';
import { useAuthContext } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AddToCartItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  source?: string;
  quantity?: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (item: AddToCartItem) => Promise<void>;
  removeFromCart: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();
  const { toast } = useToast();

  // Load cart from localStorage on mount and API when user logs in
  useEffect(() => {
    const loadCart = async () => {
      // Always try to load from localStorage first for immediate display
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          setCart(parsedCart);
        } catch (error) {
          console.error('Failed to parse saved cart:', error);
        }
      }

      // If user is logged in, sync with API
      if (user) {
        try {
          await refreshCart();
        } catch (error) {
          console.error('Failed to sync cart with API:', error);
        }
      }
    };

    loadCart();
  }, [user]);

  const refreshCart = async () => {
    // Always use localStorage data - API disabled for now
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        setCart(parsedCart);
      } catch (error) {
        console.error('Failed to parse saved cart:', error);
      }
    }
    setLoading(false);
  };

  const addToCart = async (item: AddToCartItem) => {
    // Always update local cart immediately for better UX
    const existingItemIndex = cart.findIndex(cartItem => cartItem.productId === item.productId);

    if (existingItemIndex >= 0) {
      // Update quantity if item already exists
      const updatedCart = [...cart];
      updatedCart[existingItemIndex].quantity += (item.quantity || 1);
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      // Add new item
      const newItem = {
        id: `local_${Date.now()}`,
        productId: item.productId,
        quantity: item.quantity || 1,
        product: {
          id: item.productId,
          title: item.name,
          price: { amount: item.price, currency: 'USD' },
          thumbnail: item.image,
          source: item.source
        }
      };
      const updatedCart = [...cart, newItem];
      setCart(updatedCart);
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }

    // Cart API disabled - only use localStorage
    // if (user) {
    //   try {
    //     await cachedApi.addToCart(item.productId, item.quantity || 1);
    //     await refreshCart(); // Refresh to sync with API
    //   } catch (error) {
    //     console.error('Failed to sync with API:', error);
    //     // Don't show error toast since local cart was updated
    //   }
    // }

    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };

  const removeFromCart = async (id: string) => {
    // Always update local cart immediately
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Cart API disabled - only use localStorage
    // if (user) {
    //   try {
    //     await cachedApi.removeFromCart(id);
    //     await refreshCart();
    //   } catch (error) {
    //     console.error('Failed to sync removal with API:', error);
    //   }
    // }

    toast({
      title: "Removed from cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(id);
      return;
    }

    // Always update local cart immediately
    const updatedCart = cart.map(item =>
      item.id === id ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Cart API disabled - only use localStorage
    // if (user) {
    //   try {
    //     await cachedApi.updateCartItem(id, quantity);
    //     await refreshCart();
    //   } catch (error) {
    //     console.error('Failed to sync quantity update with API:', error);
    //   }
    // }
  };

  const clearCart = async () => {
    // Always clear local cart immediately
    setCart([]);
    localStorage.removeItem('cart');

    // Cart API disabled - only use localStorage
    // if (user) {
    //   try {
    //     await cachedApi.clearCart();
    //     await refreshCart();
    //   } catch (error) {
    //     console.error('Failed to sync cart clear with API:', error);
    //   }
    // }

    toast({
      title: "Cart cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const getTotalItems = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => cart.reduce((sum, item) => {
    const price = item.product?.price?.amount || 0;
    return sum + price * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      refreshCart
    }}>
      {children}
    </CartContext.Provider>
  );
};