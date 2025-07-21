import axios from 'axios';

// Создаем экземпляр axios с базовым URL
const axiosInstance = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Добавляем перехватчик запросов для добавления токена авторизации
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Добавляем перехватчик ответов для обработки ошибок
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Если сервер вернул 401 (Unauthorized), выходим из системы
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API для работы с маркетплейсами
export const api = {
  // Аутентификация
  auth: {
    login: async (email: string, password: string) => {
      const response = await axiosInstance.post('/auth/login', { email, password });
      return response.data;
    },
    register: async (userData: any) => {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    },
    getCurrentUser: async () => {
      const response = await axiosInstance.get('/auth/me');
      return response.data;
    },
  },

  // Маркетплейсы
  marketplaces: {
    getAll: async () => {
      const response = await axiosInstance.get('/marketplaces');
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/marketplaces/${id}`);
      return response.data;
    },
    create: async (marketplaceData: any) => {
      const response = await axiosInstance.post('/marketplaces', marketplaceData);
      return response.data;
    },
    update: async (id: string, marketplaceData: any) => {
      const response = await axiosInstance.put(`/marketplaces/${id}`, marketplaceData);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await axiosInstance.delete(`/marketplaces/${id}`);
      return response.data;
    },
    connect: async (id: string, credentials: any) => {
      const response = await axiosInstance.post(`/marketplaces/${id}/connect`, credentials);
      return response.data;
    },
    disconnect: async (id: string) => {
      const response = await axiosInstance.post(`/marketplaces/${id}/disconnect`);
      return response.data;
    },
    checkStatus: async (id: string) => {
      const response = await axiosInstance.get(`/marketplaces/${id}/status`);
      return response.data;
    },
  },

  // Заказы
  orders: {
    getAll: async (params?: any) => {
      const response = await axiosInstance.get('/orders', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/orders/${id}`);
      return response.data;
    },
    update: async (id: string, orderData: any) => {
      const response = await axiosInstance.put(`/orders/${id}`, orderData);
      return response.data;
    },
    syncAll: async () => {
      const response = await axiosInstance.post('/orders/sync');
      return response.data;
    },
  },

  // Товары
  products: {
    getAll: async (params?: any) => {
      const response = await axiosInstance.get('/products', { params });
      return response.data;
    },
    getById: async (id: string) => {
      const response = await axiosInstance.get(`/products/${id}`);
      return response.data;
    },
    create: async (productData: any) => {
      const response = await axiosInstance.post('/products', productData);
      return response.data;
    },
    update: async (id: string, productData: any) => {
      const response = await axiosInstance.put(`/products/${id}`, productData);
      return response.data;
    },
    delete: async (id: string) => {
      const response = await axiosInstance.delete(`/products/${id}`);
      return response.data;
    },
    syncAll: async () => {
      const response = await axiosInstance.post('/products/sync');
      return response.data;
    },
  },

  // Аналитика
  analytics: {
    getSummary: async (params?: any) => {
      const response = await axiosInstance.get('/analytics/summary', { params });
      return response.data;
    },
    getSales: async (params?: any) => {
      const response = await axiosInstance.get('/analytics/sales', { params });
      return response.data;
    },
    getRevenue: async (params?: any) => {
      const response = await axiosInstance.get('/analytics/revenue', { params });
      return response.data;
    },
    getProductPerformance: async (params?: any) => {
      const response = await axiosInstance.get('/analytics/products', { params });
      return response.data;
    },
  },

  // Финансы
  finance: {
    getTransactions: async (params?: any) => {
      const response = await axiosInstance.get('/finance/transactions', { params });
      return response.data;
    },
    getBalance: async () => {
      const response = await axiosInstance.get('/finance/balance');
      return response.data;
    },
    getReport: async (params?: any) => {
      const response = await axiosInstance.get('/finance/report', { params });
      return response.data;
    },
  },

  // Реклама
  advertising: {
    getCampaigns: async (params?: any) => {
      const response = await axiosInstance.get('/advertising/campaigns', { params });
      return response.data;
    },
    getCampaignById: async (id: string) => {
      const response = await axiosInstance.get(`/advertising/campaigns/${id}`);
      return response.data;
    },
    createCampaign: async (campaignData: any) => {
      const response = await axiosInstance.post('/advertising/campaigns', campaignData);
      return response.data;
    },
    updateCampaign: async (id: string, campaignData: any) => {
      const response = await axiosInstance.put(`/advertising/campaigns/${id}`, campaignData);
      return response.data;
    },
    deleteCampaign: async (id: string) => {
      const response = await axiosInstance.delete(`/advertising/campaigns/${id}`);
      return response.data;
    },
    getPerformance: async (params?: any) => {
      const response = await axiosInstance.get('/advertising/performance', { params });
      return response.data;
    },
  },

  // Настройки
  settings: {
    get: async () => {
      const response = await axiosInstance.get('/settings');
      return response.data;
    },
    update: async (settingsData: any) => {
      const response = await axiosInstance.put('/settings', settingsData);
      return response.data;
    },
  },
};