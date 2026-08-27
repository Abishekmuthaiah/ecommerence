import { PRODUCT_SERVICE_BASE_URL, request } from './api';

const BASE_URL = `${PRODUCT_SERVICE_BASE_URL}/products`;

export const INITIAL_PRODUCTS = [
  {
    id: 1,
    name: 'HP Pavilion 15 Gaming Laptop',
    description: 'Intel Core i7 13th Gen, 16GB DDR5 RAM, 1TB NVMe SSD, NVIDIA RTX 4060 8GB Graphics, 144Hz FHD IPS Display, Backlit RGB Keyboard.',
    price: 55000.0,
    category: 'Computing',
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 42
  },
  {
    id: 2,
    name: 'Logitech MX Master 3S Wireless Mouse',
    description: 'Quiet clicks, 8K DPI any-surface tracking, MagSpeed electromagnetic scrolling, USB-C quick recharge, Bluetooth & Bolt receiver.',
    price: 800.0,
    category: 'Accessories',
    stock: 34,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 128
  },
  {
    id: 3,
    name: 'Apple Iphone 16 Pro Max',
    description: '200MP Quad Camera with AI Nightography, Snapdragon 8 Gen 3 Processor, Dynamic AMOLED 2X 120Hz Display, S-Pen included, Titanium Gray.',
    price: 125000.0,
    category: 'Electronics',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 85
  },
  {
    id: 4,
    name: 'Sony WH-1000XM5 Noise-Canceling Headphones',
    description: 'Industry-leading active noise cancellation with 8 microphones, 30-hour battery life, speak-to-chat technology, crystal clear hands-free calling.',
    price: 1500.0,
    category: 'Audio',
    stock: 25,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    numReviews: 210
  },
  {
    id: 5,
    name: 'Apple Watch Series 9 GPS',
    description: 'Advanced health sensors, ECG, Crash Detection, brighter Always-On Retina display, S9 SiP chip, double tap gesture, Midnight Aluminum Case.',
    price: 12000.0,
    category: 'Wearables',
    stock: 18,
    imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 64
  },
  {
    id: 6,
    name: 'Dell UltraSharp 27 4K Monitor',
    description: 'IPS Black panel with 2000:1 contrast ratio, 98% DCI-P3 color gamut, USB-C hub with 90W power delivery, height adjustable stand.',
    price: 28500.0,
    category: 'Electronics',
    stock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    numReviews: 33
  },
  {
    id: 7,
    name: 'Keychron K2 Pro Mechanical Keyboard',
    description: 'Wireless/Wired custom mechanical keyboard with QMK/VIA support, hot-swappable Gateron G Pro switches, RGB backlighting, Mac & Windows layout.',
    price: 6500.0,
    category: 'Accessories',
    stock: 39,
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    numReviews: 79
  },
  {
    id: 8,
    name: 'Bose SoundLink Revolve+ II Bluetooth Speaker',
    description: 'True 360° sound for consistent, uniform coverage, seamless aluminum body, water and dust resistant (IP55), up to 17 hours battery.',
    price: 18900.0,
    category: 'Audio',
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80',
    rating: 4.6,
    numReviews: 52
  }
];

function getLocalProducts() {
  const saved = localStorage.getItem('shopzone_products');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
  }
  localStorage.setItem('shopzone_products', JSON.stringify(INITIAL_PRODUCTS));
  return INITIAL_PRODUCTS;
}

function saveLocalProducts(products) {
  localStorage.setItem('shopzone_products', JSON.stringify(products));
}

export const productService = {
  /**
   * GET /api/products (with optional category or search)
   */
  async getAllProducts(params = {}) {
    try {
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
    } catch (err) {
      // Fallback to local products
      let list = getLocalProducts();
      if (params.category && params.category !== 'All') {
        list = list.filter(p => p.category?.toLowerCase() === params.category.toLowerCase());
      }
      if (params.search) {
        const s = params.search.toLowerCase();
        list = list.filter(p => p.name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
      }
      return list;
    }
  },

  /**
   * GET /api/products/{id}
   */
  async getProductById(id) {
    try {
      return await request(`${BASE_URL}/${id}`);
    } catch (err) {
      const list = getLocalProducts();
      return list.find(p => p.id === Number(id)) || null;
    }
  },

  /**
   * GET /api/products/search?name=laptop
   */
  async searchProducts(name) {
    try {
      return await request(`${BASE_URL}/search?name=${encodeURIComponent(name || '')}`);
    } catch (err) {
      const s = (name || '').toLowerCase();
      return getLocalProducts().filter(p => p.name?.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s));
    }
  },

  /**
   * GET /api/products/categories
   */
  async getCategories() {
    try {
      return await request(`${BASE_URL}/categories`);
    } catch (err) {
      const list = getLocalProducts();
      return Array.from(new Set(list.map(p => p.category)));
    }
  },

  /**
   * POST /api/products
   */
  async createProduct(productData) {
    try {
      return await request(BASE_URL, {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (err) {
      const list = getLocalProducts();
      const newP = {
        ...productData,
        id: Date.now(),
        rating: 5.0,
        numReviews: 0
      };
      list.push(newP);
      saveLocalProducts(list);
      return newP;
    }
  },

  /**
   * PUT /api/products/{id}
   */
  async updateProduct(id, productData) {
    try {
      return await request(`${BASE_URL}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (err) {
      const list = getLocalProducts();
      const idx = list.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        list[idx] = { ...list[idx], ...productData };
        saveLocalProducts(list);
        return list[idx];
      }
      return productData;
    }
  },

  /**
   * DELETE /api/products/{id}
   */
  async deleteProduct(id) {
    try {
      return await request(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
    } catch (err) {
      const list = getLocalProducts().filter(p => p.id !== Number(id));
      saveLocalProducts(list);
      return true;
    }
  },

  /**
   * GET /api/products/{id}/check-stock?quantity=1
   */
  async checkStock(id, quantity = 1) {
    try {
      return await request(`${BASE_URL}/${id}/check-stock?quantity=${quantity}`);
    } catch (err) {
      const p = getLocalProducts().find(item => item.id === Number(id));
      const available = p ? p.stock >= quantity : false;
      return {
        productId: Number(id),
        productName: p?.name || '',
        requestedQuantity: quantity,
        currentStock: p?.stock || 0,
        available
      };
    }
  },

  /**
   * PUT /api/products/{id}/stock?quantity=1
   */
  async updateStock(id, quantity, newStock = null) {
    try {
      let url = `${BASE_URL}/${id}/stock?quantity=${quantity}`;
      if (newStock !== null) {
        url = `${BASE_URL}/${id}/stock?newStock=${newStock}`;
      }
      return await request(url, {
        method: 'PUT',
      });
    } catch (err) {
      const list = getLocalProducts();
      const idx = list.findIndex(p => p.id === Number(id));
      if (idx !== -1) {
        if (newStock !== null) {
          list[idx].stock = newStock;
        } else {
          list[idx].stock = Math.max(0, list[idx].stock - quantity);
        }
        saveLocalProducts(list);
        return list[idx];
      }
      return null;
    }
  }
};

