import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      // Don't redirect if already on login pages, register pages, or landing page
      if (!currentPath.includes('/login') && !currentPath.includes('/register') && currentPath !== '/') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

const services = {
  auth: {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    adminLogin: (data) => api.post('/auth/admin-login', data),
    googleLogin: (data) => api.post('/auth/google', data),
    getMe: () => api.get('/auth/me'),
  },
  registrations: {
    create: (data) => api.post('/registrations', data),
    getMine: () => api.get('/registrations/me'),
    updateMine: (data) => api.put('/registrations/me', data),
  },
  payments: {
    submit: (data) => api.post('/payments/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }),
    getMine: () => api.get('/payments/me'),
  },
  admin: {
    getDashboard: () => api.get('/admin/dashboard'),
    getRegistrations: (params) => api.get('/admin/registrations', { params }),
    getRegistration: (id) => api.get(`/admin/registrations/${id}`),
    updateStatus: (id, data) => api.put(`/admin/registrations/${id}/status`, data),
    verifyPayment: (id) => api.put(`/admin/payments/${id}/verify`),
    rejectPayment: (id, data) => api.put(`/admin/payments/${id}/reject`, data),
    exportXlsx: () => api.get('/admin/export/xlsx', { responseType: 'blob' }),
    exportCsv: () => api.get('/admin/export/csv', { responseType: 'blob' }),
  }
};

export { api };
export default services;
