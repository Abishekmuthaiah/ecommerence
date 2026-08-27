import { ORDER_SERVICE_BASE_URL, request } from './api';
import { productService } from './productService';

const CART_URL = `${ORDER_SERVICE_BASE_URL}/cart`;
const ORDER_URL = `${ORDER_SERVICE_BASE_URL}/orders`;

function getLocalCart(userId) {
  const key = `shopzone_cart_${userId}`;
  const saved = localStorage.getItem(key);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  const initial = {
    cartId: Number(userId),
    userId: Number(userId),
    items: [],
    totalItems: 0,
    subtotal: 0,
    estimatedTax: 0,
    shippingFee: 0,
    finalTotal: 0
  };
  localStorage.setItem(key, JSON.stringify(initial));
  return initial;
}

function saveLocalCart(userId, cart) {
  const key = `shopzone_cart_${userId}`;
  localStorage.setItem(key, JSON.stringify(cart));
}

function recalculateCart(cart) {
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const estimatedTax = Math.round(subtotal * 0.05);
  const shippingFee = subtotal > 1000 || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal + estimatedTax + shippingFee;
  return {
    ...cart,
    totalItems,
    subtotal,
    estimatedTax,
    shippingFee,
    finalTotal
  };
}

function getLocalOrders() {
  const saved = localStorage.getItem('shopzone_orders');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  return [];
}

function saveLocalOrders(orders) {
  localStorage.setItem('shopzone_orders', JSON.stringify(orders));
}

export const orderService = {
  // ================= Cart APIs =================

  async getCart(userId) {
    try {
      return await request(`${CART_URL}/${userId}`);
    } catch (err) {
      return getLocalCart(userId);
    }
  },

  async addItemToCart(userId, productId, quantity = 1) {
    try {
      return await request(`${CART_URL}/${userId}/items`, {
        method: 'POST',
        body: JSON.stringify({ productId, quantity }),
      });
    } catch (err) {
      const cart = getLocalCart(userId);
      const product = await productService.getProductById(productId);
      const existing = cart.items.find(i => i.productId === Number(productId));
      if (existing) {
        existing.quantity += quantity;
        existing.itemTotal = existing.quantity * existing.price;
      } else if (product) {
        cart.items.push({
          id: Date.now(),
          productId: product.id,
          productName: product.name,
          price: product.price,
          quantity,
          itemTotal: product.price * quantity,
          imageUrl: product.imageUrl,
          currentStock: product.stock
        });
      }
      const updated = recalculateCart(cart);
      saveLocalCart(userId, updated);
      return updated;
    }
  },

  async updateCartItemQuantity(userId, productId, quantity) {
    try {
      return await request(`${CART_URL}/${userId}/items/${productId}?quantity=${quantity}`, {
        method: 'PUT',
      });
    } catch (err) {
      const cart = getLocalCart(userId);
      const item = cart.items.find(i => i.productId === Number(productId));
      if (item) {
        item.quantity = quantity;
        item.itemTotal = quantity * item.price;
      }
      const updated = recalculateCart(cart);
      saveLocalCart(userId, updated);
      return updated;
    }
  },

  async removeCartItem(userId, productId) {
    try {
      return await request(`${CART_URL}/${userId}/items/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const cart = getLocalCart(userId);
      cart.items = cart.items.filter(i => i.productId !== Number(productId));
      const updated = recalculateCart(cart);
      saveLocalCart(userId, updated);
      return updated;
    }
  },

  async clearCart(userId) {
    try {
      return await request(`${CART_URL}/${userId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const empty = {
        cartId: Number(userId),
        userId: Number(userId),
        items: [],
        totalItems: 0,
        subtotal: 0,
        estimatedTax: 0,
        shippingFee: 0,
        finalTotal: 0
      };
      saveLocalCart(userId, empty);
      return empty;
    }
  },

  // ================= Order APIs =================

  async placeOrder(orderPayload) {
    try {
      return await request(ORDER_URL, {
        method: 'POST',
        body: JSON.stringify(orderPayload),
      });
    } catch (err) {
      const orders = getLocalOrders();
      const newOrder = {
        id: orders.length + 101,
        userId: orderPayload.userId,
        customerName: orderPayload.customerName,
        customerEmail: orderPayload.customerEmail,
        customerPhone: orderPayload.customerPhone,
        shippingAddress: orderPayload.shippingAddress,
        paymentMethod: orderPayload.paymentMethod,
        orderDate: new Date().toISOString(),
        status: 'CONFIRMED',
        totalAmount: (orderPayload.items || []).reduce((s, i) => s + (i.price * i.quantity), 0),
        items: (orderPayload.items || []).map((it, idx) => ({
          id: Date.now() + idx,
          productId: it.productId,
          productName: it.productName,
          price: it.price,
          quantity: it.quantity,
          imageUrl: it.imageUrl
        }))
      };
      orders.unshift(newOrder);
      saveLocalOrders(orders);
      this.clearCart(orderPayload.userId);
      return newOrder;
    }
  },

  async createOrder(orderPayload) {
    return await this.placeOrder(orderPayload);
  },

  async getAllOrders() {
    try {
      return await request(ORDER_URL);
    } catch (err) {
      return getLocalOrders();
    }
  },

  async getUserOrders(userId) {
    try {
      return await request(`${ORDER_URL}/${userId}`);
    } catch (err) {
      const all = getLocalOrders();
      return all.filter(o => o.userId === Number(userId));
    }
  },

  async getOrderById(orderId) {
    try {
      return await request(`${ORDER_URL}/details/${orderId}`);
    } catch (err) {
      const all = getLocalOrders();
      return all.find(o => o.id === Number(orderId)) || null;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      return await request(`${ORDER_URL}/${orderId}/status?status=${status}`, {
        method: 'PUT',
      });
    } catch (err) {
      const all = getLocalOrders();
      const ord = all.find(o => o.id === Number(orderId));
      if (ord) {
        ord.status = status;
        saveLocalOrders(all);
        return ord;
      }
      return null;
    }
  }
};

