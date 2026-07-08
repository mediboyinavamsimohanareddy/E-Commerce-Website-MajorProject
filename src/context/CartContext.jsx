// CartContext — manages shopping cart state

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  // Load cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart({ items: [], totalPrice: 0 });
    }
  }, [isAuthenticated]);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.data);
    } catch {
      setCart({ items: [], totalPrice: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (productId, quantity = 1) => {
    try {
      setLoading(true);
      const { data } = await cartAPI.add(productId, quantity);
      setCart(data.data);
      return true;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateQuantity = useCallback(async (itemId, quantity) => {
    try {
      const { data } = await cartAPI.updateItem(itemId, quantity);
      setCart(data.data);
    } catch (error) {
      throw error;
    }
  }, []);

  const removeFromCart = useCallback(async (itemId) => {
    try {
      const { data } = await cartAPI.removeItem(itemId);
      setCart(data.data);
    } catch (error) {
      throw error;
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setCart({ items: [], totalPrice: 0 });
    } catch (error) {
      throw error;
    }
  }, []);

  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const value = {
    cart,
    loading,
    cartCount,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
