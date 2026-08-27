import { PRODUCT_SERVICE_BASE_URL, request } from './api';

const BASE_URL = `${PRODUCT_SERVICE_BASE_URL}/products`;

export const productService = {
  /**
   * GET /api/products (with optional category or search)
   */
  async getAllProducts(params = {}) {
    let query = '';
    const queryParams = new URLSearchParams();
    if (params.category && params.category !== 'All') {
      queryParams.append('category', params.category);
    }
    if (params.search) {
      queryParams.append('search', params.search);
    }
    const qStr = queryParams.toString();
    if (qStr) query = `?${qStr}`;
    return await request(`${BASE_URL}${query}`);
  },

  /**
   * GET /api/products/{id}
   */
  async getProductById(id) {
    return await request(`${BASE_URL}/${id}`);
  },

  /**
   * GET /api/products/search?name=laptop
   */
  async searchProducts(name) {
    return await request(`${BASE_URL}/search?name=${encodeURIComponent(name || '')}`);
  },

  /**
   * GET /api/products/categories
   */
  async getCategories() {
    return await request(`${BASE_URL}/categories`);
  },

  /**
   * POST /api/products
   */
  async createProduct(productData) {
    return await request(BASE_URL, {
      method: 'POST',
      body: JSON.stringify(productData),
    });
  },

  /**
   * PUT /api/products/{id}
   */
  async updateProduct(id, productData) {
    return await request(`${BASE_URL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(productData),
    });
  },

  /**
   * DELETE /api/products/{id}
   */
  async deleteProduct(id) {
    return await request(`${BASE_URL}/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * GET /api/products/{id}/check-stock?quantity=1
   */
  async checkStock(id, quantity = 1) {
    return await request(`${BASE_URL}/${id}/check-stock?quantity=${quantity}`);
  },

  /**
   * PUT /api/products/{id}/stock?quantity=1
   */
  async updateStock(id, quantity, newStock = null) {
    let url = `${BASE_URL}/${id}/stock?quantity=${quantity}`;
    if (newStock !== null) {
      url = `${BASE_URL}/${id}/stock?newStock=${newStock}`;
    }
    return await request(url, {
      method: 'PUT',
    });
  }
};
