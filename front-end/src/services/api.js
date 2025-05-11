import axios from 'axios';


const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Response interceptor to handle API responses and errors
api.interceptors.response.use(
  (response) => {
    const apiResponse = response.data;
    
    // If the response indicates an error, reject with the error message
    if (!apiResponse.success && apiResponse.message) {
      return Promise.reject(new Error(apiResponse.message));
    }
    
    // For successful responses, return the data or the full response if no data field
    return apiResponse.data || apiResponse;
  },
  (error) => {
    let errorMessage = 'Đã có lỗi xảy ra';
    let statusCode = error.response?.status;
    
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.request) {
      errorMessage = 'Không thể kết nối đến máy chủ';
    }

    // Create error object with additional information
    const enhancedError = new Error(errorMessage);
    enhancedError.statusCode = statusCode;
    enhancedError.originalError = error;

    // Don't show message here, let components handle it
    return Promise.reject(enhancedError);
  }
);

// Categories API (Loại sản phẩm)
export const categoryApi = {
  getAllCategories: () => api.get('/loai-san-pham'),
  getCategoryById: (id) => api.get(`/loai-san-pham/${parseInt(id)}`),
  createCategory: (data) => api.post('/loai-san-pham', data),
  updateCategory: (id, data) => api.put(`/loai-san-pham/${parseInt(id)}`, data),
  deleteCategory: (id) => api.delete(`/loai-san-pham/${parseInt(id)}`),
};

// Products API (Sản phẩm)
export const productApi = {
  getAllProducts: () => api.get('/san-pham'),
  getProductById: (id) => api.get(`/san-pham/${id}`),
  createProduct: (data) => api.post('/san-pham', data),
  updateProduct: (id, data) => api.put(`/san-pham/${id}`, data),
  deleteProduct: (id) => api.delete(`/san-pham/${id}`),
};

// Orders API (Đơn hàng)
export const orderApi = {
  getAllOrders: () => api.get('/don-hang'),
  getOrderById: (id) => api.get(`/don-hang/${id}`),
  createOrder: (data) => api.post('/don-hang', data),
  updateOrder: (id, data) => api.put(`/don-hang/${id}`, data),
  deleteOrder: (id) => api.delete(`/don-hang/${id}`),
};

// Customers API (Khách hàng)
export const customerApi = {
  getAllCustomers: () => api.get('/khach-hang'),
  getCustomerById: (id) => api.get(`/khach-hang/${id}`),
  createCustomer: (data) => api.post('/khach-hang', data),
  updateCustomer: (id, data) => api.put(`/khach-hang/${id}`, data),
  deleteCustomer: (maKhachHang) => api.delete(`/khach-hang/${maKhachHang}`),
};

// Order Details API
export const orderDetailApi = {
  getOrderDetails: (orderId) => api.get(`/chi-tiet-don-hang/${orderId}`),
  createOrderDetail: (data) => api.post('/chi-tiet-don-hang', data),
  updateOrderDetail: (id, data) => api.put(`/chi-tiet-don-hang/${id}`, data),
  deleteOrderDetail: (id) => api.delete(`/chi-tiet-don-hang/${id}`),
};

// Auth API (Đăng ký & Đăng nhập)
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};
