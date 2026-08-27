import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { orderService } from '../services/orderService';
import { useUser } from './UserContext';
import confetti from 'canvas-confetti';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { currentUser } = useUser();
  const currentUserId = currentUser?.id || 1;
  const [cart, setCart] = useState({
    cartId: null,
    userId: currentUserId,
    items: [],
    totalItems: 0,
    subtotal: 0,
    estimatedTax: 0,
    shippingFee: 0,
    finalTotal: 0
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const data = await orderService.getCart(currentUserId);
      if (data) {
        setCart(data);
      }
    } catch (err) {
      console.warn('Could not fetch cart from microservice:', err.message);
    } finally {
      setLoading(false);
    }
  }, [currentUserId]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productId, quantity = 1, productName = '') => {
    try {
      setLoading(true);
      const updated = await orderService.addItemToCart(currentUserId, productId, quantity);
      setCart(updated);
      showToast(`Added ${quantity > 1 ? quantity + 'x ' : ''}${productName || 'product'} to cart!`, 'success');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to add item to cart', 'error');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    try {
      const updated = await orderService.updateCartItemQuantity(currentUserId, productId, quantity);
      setCart(updated);
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to update quantity', 'error');
      return false;
    }
  };

  const removeFromCart = async (productId, productName = '') => {
    try {
      const updated = await orderService.removeCartItem(currentUserId, productId);
      setCart(updated);
      showToast(`Removed ${productName || 'item'} from cart`, 'info');
      return true;
    } catch (err) {
      showToast(err.message || 'Failed to remove item', 'error');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await orderService.clearCart(currentUserId);
      setCart({
        cartId: cart.cartId,
        userId: currentUserId,
        items: [],
        totalItems: 0,
        subtotal: 0,
        estimatedTax: 0,
        shippingFee: 0,
        finalTotal: 0
      });
      showToast('Cart cleared', 'info');
    } catch (err) {
      showToast(err.message || 'Failed to clear cart', 'error');
    }
  };

  const checkout = async (checkoutData) => {
    try {
      setLoading(true);
      const payload = {
        userId: currentUserId,
        customerName: checkoutData.name || currentUser?.name || 'Alex Johnson',
        customerEmail: checkoutData.email || currentUser?.email || 'alex@example.com',
        customerPhone: checkoutData.phone || currentUser?.phone || '+91 9876543210',
        shippingAddress: checkoutData.address || currentUser?.address || 'Bangalore, India',
        paymentMethod: checkoutData.paymentMethod || 'Credit/Debit Card'
      };

      const orderResult = await orderService.placeOrder(payload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Clear local cart
      setCart(prev => ({
        ...prev,
        items: [],
        totalItems: 0,
        subtotal: 0,
        estimatedTax: 0,
        shippingFee: 0,
        finalTotal: 0
      }));

      showToast(`Order #${orderResult.id} placed successfully!`, 'success');
      return orderResult;
    } catch (err) {
      showToast(err.message || 'Failed to place order', 'error');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{
      cart,
      loading,
      toasts,
      showToast,
      removeToast,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      checkout
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
