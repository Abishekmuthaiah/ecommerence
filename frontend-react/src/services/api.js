/**
 * Central API configuration and helper client
 */

export const PRODUCT_SERVICE_BASE_URL = 'http://localhost:8081/api';
export const ORDER_SERVICE_BASE_URL = 'http://localhost:8082/api';

/**
 * Standard fetch helper with error handling
 */
export async function request(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const config = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
      try {
        const errorData = await response.json();
        if (errorData.error) errorMsg = errorData.error;
        else if (errorData.message) errorMsg = errorData.message;
      } catch (e) {
        // Not JSON
      }
      throw new Error(errorMsg);
    }

    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (error) {
    console.error(`API Error on ${url}:`, error);
    throw error;
  }
}

/**
 * Check health of backend microservices
 */
export async function checkServicesHealth() {
  const result = {
    productService: false,
    orderService: false,
  };

  try {
    const res = await fetch(`${PRODUCT_SERVICE_BASE_URL}/products`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    result.productService = res.ok;
  } catch (e) {
    result.productService = false;
  }

  try {
    const res = await fetch(`${ORDER_SERVICE_BASE_URL}/cart/1`, { method: 'GET', signal: AbortSignal.timeout(2000) });
    result.orderService = res.ok;
  } catch (e) {
    result.orderService = false;
  }

  return result;
}
