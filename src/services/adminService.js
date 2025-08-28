import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// 보안 설정
const SECURITY_CONFIG = {
  // CSRF 토큰 설정
  csrfToken: null,
  
  // 요청 재시도 설정
  maxRetries: 3,
  retryDelay: 1000,
  
  // 타임아웃 설정
  timeout: 10000,
  
  // 요청 헤더 설정
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  }
};

// Create axios instance with default config
const api = axios.create({
  baseURL: `${API_BASE_URL}/admin`,
  timeout: SECURITY_CONFIG.timeout,
  headers: SECURITY_CONFIG.headers,
  withCredentials: true, // 쿠키 포함
});

// Request interceptor to add auth token and security headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // CSRF 토큰 추가
    if (SECURITY_CONFIG.csrfToken) {
      config.headers['X-CSRF-Token'] = SECURITY_CONFIG.csrfToken;
    }
    
    // 요청 ID 추가 (추적용)
    config.headers['X-Request-ID'] = generateRequestId();
    
    // 타임스탬프 추가
    config.headers['X-Timestamp'] = Date.now();
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and security
api.interceptors.response.use(
  (response) => {
    // 응답 데이터 검증
    if (response.data && typeof response.data === 'object') {
      // 민감한 데이터 필터링 (필요시)
      // response.data = filterSensitiveData(response.data, userRole);
    }
    
    // CSRF 토큰 업데이트
    const newCsrfToken = response.headers['x-csrf-token'];
    if (newCsrfToken) {
      SECURITY_CONFIG.csrfToken = newCsrfToken;
    }
    
    return response.data;
  },
  (error) => {
    // 보안 관련 에러 처리
    if (error.response?.status === 401) {
      localStorage.removeItem('adminToken');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      console.warn('Access forbidden - insufficient permissions');
    } else if (error.response?.status === 429) {
      console.warn('Rate limit exceeded');
    }
    
    // 에러 로깅
    logApiError(error);
    
    return Promise.reject(error.response?.data || error);
  }
);

export const adminService = {
  // Authentication
  async login(username, password, totpCode = null) {
    const payload = { username, password };
    if (totpCode) {
      payload.totpCode = totpCode;
    }
    return api.post('/auth/login', payload);
  },

  async verifyToken() {
    return api.get('/auth/verify');
  },

  async setupMFA() {
    return api.post('/auth/mfa/setup');
  },

  async verifyMFA(totpCode) {
    return api.post('/auth/mfa/verify', { totpCode });
  },

  async disableMFA() {
    return api.post('/auth/mfa/disable');
  },

  // User Management
  async getUsers(page = 1, limit = 20, search = '') {
    return api.get('/users', { params: { page, limit, search } });
  },

  async getUserById(userId) {
    return api.get(`/users/${userId}`);
  },

  async updateUser(userId, userData) {
    return api.put(`/users/${userId}`, userData);
  },

  async deleteUser(userId) {
    return api.delete(`/users/${userId}`);
  },

  async banUser(userId, reason) {
    return api.post(`/users/${userId}/ban`, { reason });
  },

  async unbanUser(userId) {
    return api.post(`/users/${userId}/unban`);
  },

  // Post Management
  async getPosts(page = 1, limit = 20, status = 'all') {
    return api.get('/posts', { params: { page, limit, status } });
  },

  async getPostById(postId) {
    return api.get(`/posts/${postId}`);
  },

  async updatePost(postId, postData) {
    return api.put(`/posts/${postId}`, postData);
  },

  async deletePost(postId) {
    return api.delete(`/posts/${postId}`);
  },

  async approvePost(postId) {
    return api.post(`/posts/${postId}/approve`);
  },

  async rejectPost(postId, reason) {
    return api.post(`/posts/${postId}/reject`, { reason });
  },

  // Security Settings
  async getSecuritySettings() {
    return api.get('/security/settings');
  },

  async updateSecuritySettings(settings) {
    return api.put('/security/settings', settings);
  },

  async getIPWhitelist() {
    return api.get('/security/ip-whitelist');
  },

  async addIPToWhitelist(ip) {
    return api.post('/security/ip-whitelist', { ip });
  },

  async removeIPFromWhitelist(ip) {
    return api.delete(`/security/ip-whitelist/${ip}`);
  },

  // System Logs
  async getSystemLogs(page = 1, limit = 50, level = 'all') {
    return api.get('/logs', { params: { page, limit, level } });
  },

  async getLoginLogs(page = 1, limit = 50) {
    return api.get('/logs/login', { params: { page, limit } });
  },

  async getAdminLogs(page = 1, limit = 50) {
    return api.get('/logs/admin', { params: { page, limit } });
  },

  // Dashboard Statistics
  async getDashboardStats() {
    return api.get('/dashboard/stats');
  },

  async getRecentActivity() {
    return api.get('/dashboard/recent-activity');
  },

  // Password Policy
  async validatePassword(password) {
    return api.post('/security/validate-password', { password });
  },

  async changePassword(oldPassword, newPassword) {
    return api.post('/auth/change-password', { oldPassword, newPassword });
  },
};

// 유틸리티 함수들
const generateRequestId = () => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const logApiError = (error) => {
  const errorLog = {
    timestamp: new Date().toISOString(),
    url: error.config?.url,
    method: error.config?.method,
    status: error.response?.status,
    message: error.message,
    requestId: error.config?.headers?.['X-Request-ID'],
  };
  
  console.error('API Error:', errorLog);
  
  // 실제 구현에서는 서버로 에러 로그를 전송
  // sendErrorLog(errorLog);
}; 