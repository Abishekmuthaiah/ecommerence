import { ORDER_SERVICE_BASE_URL, request } from './api';

const CART_URL = `${ORDER_SERVICE_BASE_URL}/cart`;
const ORDER_URL = `${ORDER_SERVICE_BASE_URL}/orders`;

export const orderService = {
  // ================= Cart APIs =================

  /**
   * GET /api/cart/{userId}
   */
  async getCart(userId) {
    return await request(`${CART_URL}/${userId}`);
  },

  /**
   * POST /api/cart/{userId}/items
   */
  async addItemToCart(userId, productId, quantity = 1) {
    return await request(`${CART_URL}/${userId}/items`, {
      method: 'POST',
      body: JSON.stringify({ productId, quantity }),
    });
  },

  /**
   * PUT /api/cart/{userId}/items/{productId}?quantity=...
   */
  async updateCartItemQuantity(userId, productId, quantity) {
    return await request(`${CART_URL}/${userId}/items/${productId}?quantity=${quantity}`, {
      method: 'PUT',
    });
  },

  /**
   * DELETE /api/cart/{userId}/items/{productId}
   */
  async removeCartItem(userId, productId) {
    return await request(`${CART_URL}/${userId}/items/${productId}`, {
      method: 'DELETE',
    });
  },

  /**
   * DELETE /api/cart/{userId}
   */
  async clearCart(userId) {
    return await request(`${CART_URL}/${userId}`, {
      method: 'DELETE',
    });
  },

  // ================= Order APIs =================

  /**
   * POST /api/orders
   */
  async placeOrder(orderPayload) {
    return await request(ORDER_URL, {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    });
  },

  async createOrder(orderPayload) {
    return await this.placeOrder(orderPayload);
  },

  /**
   * GET /api/orders
   */
  async getAllOrders() {
    return await request(ORDER_URL);
  },

  /**
   * GET /api/orders/{userId}
   */
  async getUserOrders(userId) {
    return await request(`${ORDER_URL}/${userId}`);
  },

  /**
   * GET /api/orders/details/{orderId}
   */
  async getOrderById(orderId) {
    return await request(`${ORDER_URL}/details/${orderId}`);
  },

  /**
   * PUT /api/orders/{orderId}/status?status=...
   */
  async updateOrderStatus(orderId, status) {
    return await request(`${ORDER_URL}/${orderId}/status?status=${status}`, {
      method: 'PUT',
    });
  }
};
