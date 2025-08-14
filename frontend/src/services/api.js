// API Base URL
const API_BASE_URL = 'http://localhost:3000/api';

// API client configuration
const apiClient = {
  get: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('GET request xatosi:', error);
      throw error;
    }
  },

  post: async (url, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('POST request xatosi:', error);
      throw error;
    }
  },

  put: async (url, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('PUT request xatosi:', error);
      throw error;
    }
  },

  delete: async (url) => {
    try {
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('DELETE request xatosi:', error);
      throw error;
    }
  }
};

// Questions API service
export const questionsAPI = {
  // Barcha savollarni olish
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/questions?${queryString}` : '/questions';
    return await apiClient.get(url);
  },

  // Bitta savolni olish
  getById: async (id) => {
    return await apiClient.get(`/questions/${id}`);
  },

  // Yangi savol yaratish
  create: async (questionData) => {
    return await apiClient.post('/questions', questionData);
  },

  // Savolni yangilash
  update: async (id, questionData) => {
    return await apiClient.put(`/questions/${id}`, questionData);
  },

  // Savolni o'chirish
  delete: async (id) => {
    return await apiClient.delete(`/questions/${id}`);
  },

  // Kategoriyalar ro'yxatini olish
  getCategories: async () => {
    return await apiClient.get('/questions/categories/list');
  },

  // Statistika olish
  getStats: async () => {
    return await apiClient.get('/questions/stats/overview');
  }
};

// Test Results API service
export const testResultsAPI = {
  // Test natijasini saqlash
  create: async (resultData) => {
    return await apiClient.post('/test-results', resultData);
  },

  // Barcha test natijalarini olish
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/test-results?${queryString}` : '/test-results';
    return await apiClient.get(url);
  },

  // Bitta test natijasini olish
  getById: async (id) => {
    return await apiClient.get(`/test-results/${id}`);
  },

  // Statistika olish
  getStats: async () => {
    return await apiClient.get('/test-results/stats/overview');
  },

  // Foydalanuvchi natijalarini olish
  getUserResults: async (userName, limit = 10) => {
    return await apiClient.get(`/test-results/user/${userName}?limit=${limit}`);
  },

  // Test natijasini o'chirish
  delete: async (id) => {
    return await apiClient.delete(`/test-results/${id}`);
  }
};

// User Reviews API service
export const reviewsAPI = {
  // Yangi sharh qo'shish
  create: async (reviewData) => {
    return await apiClient.post('/reviews', reviewData);
  },

  // Barcha sharhlarni olish (admin)
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `/reviews?${queryString}` : '/reviews';
    return await apiClient.get(url);
  },

  // Tasdiqlangan sharhlarni olish
  getApproved: async (limit = 10) => {
    return await apiClient.get(`/reviews/approved?limit=${limit}`);
  },

  // Sharhni yangilash (tasdiqlash/rad etish)
  update: async (id, updateData) => {
    return await apiClient.put(`/reviews/${id}`, updateData);
  },

  // Sharhni o'chirish
  delete: async (id) => {
    return await apiClient.delete(`/reviews/${id}`);
  },

  // Reyting statistikasini olish
  getRatingStats: async () => {
    return await apiClient.get('/reviews/stats/ratings');
  }
};

// Server holatini tekshirish
export const healthAPI = {
  check: async () => {
    try {
      const response = await fetch('http://localhost:3000/health');
      return await response.json();
    } catch (error) {
      console.error('Server bilan aloqa xatosi:', error);
      throw error;
    }
  }
};

// Xato xabarlarini formatting qilish
export const formatError = (error) => {
  if (error.message) {
    return error.message;
  }
  
  if (typeof error === 'string') {
    return error;
  }
  
  return 'Noma\'lum xato yuz berdi';
};

// Loading state management
export const createLoadingState = () => ({
  isLoading: false,
  error: null,
  data: null
});

export default { questionsAPI, testResultsAPI, reviewsAPI, healthAPI, formatError, createLoadingState };
