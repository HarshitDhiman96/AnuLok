const API_BASE_URL = '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('anulok_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  async login(identifier, password) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to login');
    return data;
  },

  async sendRegistrationOtp(email, name = '', phone = '') {
    const res = await fetch(`${API_BASE_URL}/auth/send-registration-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, phone })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to send verification code');
    return data;
  },

  async register(userData) {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create account');
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to get user profile');
    return data;
  },

  async changePassword(currentPassword, newPassword) {
    const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to change password');
    return data;
  },

  async updateProfile(profileData) {
    const res = await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update profile');
    return data;
  },

  // Products
  async getProducts(params = {}) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        query.append(key, val);
      }
    });
    const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch products');
    return data;
  },

  async getProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch product');
    return data;
  },

  async createProduct(productData) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data;
  },

  async updateProduct(id, productData) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data;
  },

  async deleteProduct(id) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch categories');
    return data;
  },

  async createCategory(catData) {
    const res = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(catData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create category');
    return data;
  },

  async updateCategory(id, catData) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(catData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update category');
    return data;
  },

  async deleteCategory(id) {
    const res = await fetch(`${API_BASE_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  // Coupons
  async validateCoupon(code, cartSubtotal) {
    const res = await fetch(`${API_BASE_URL}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, cartSubtotal })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || data.error || 'Invalid coupon');
    return data;
  },

  async getCoupons() {
    const res = await fetch(`${API_BASE_URL}/coupons`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch coupons');
    return data;
  },

  async createCoupon(couponData) {
    const res = await fetch(`${API_BASE_URL}/coupons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create coupon');
    return data;
  },

  async updateCoupon(id, couponData) {
    const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(couponData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update coupon');
    return data;
  },

  async deleteCoupon(id) {
    const res = await fetch(`${API_BASE_URL}/coupons/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete coupon');
    return data;
  },

  // Orders
  async createOrder(orderData) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create order');
    return data;
  },

  async getMyOrders() {
    const res = await fetch(`${API_BASE_URL}/orders/my`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch your orders');
    return data;
  },

  async getOrder(id) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch order');
    return data;
  },

  async getAllOrders(params = {}) {
    const query = new URLSearchParams(params);
    const res = await fetch(`${API_BASE_URL}/orders?${query.toString()}`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin orders');
    return data;
  },

  async updateOrderStatus(id, status) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  // Admin
  async getAdminStats() {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch admin statistics');
    return data;
  },

  async getAdminCustomers() {
    const res = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: getAuthHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch customers');
    return data;
  }
};
