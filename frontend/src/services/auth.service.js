import api from './api';

const TOKEN_KEY = 'royaljeans_token';
const USER_KEY = 'royaljeans_user';
const REFRESH_TOKEN_KEY = 'royaljeans_refresh_token';

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      
      if (response.data.token) {
        // ذخیره اطلاعات در localStorage
        localStorage.setItem(TOKEN_KEY, response.data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        // ذخیره در sessionStorage برای امنیت بیشتر
        sessionStorage.setItem(TOKEN_KEY, response.data.token);
        sessionStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
        
        // ذخیره در cookie برای persistence
        document.cookie = `${TOKEN_KEY}=${response.data.token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
        document.cookie = `${USER_KEY}=${encodeURIComponent(JSON.stringify(response.data.user))}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
      }
      
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout: () => {
    // پاک کردن از همه storage ها
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    
    // پاک کردن cookies
    document.cookie = `${TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${USER_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `${REFRESH_TOKEN_KEY}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  getCurrentUser: () => {
    // ابتدا از sessionStorage بگیریم (امن‌تر)
    let userStr = sessionStorage.getItem(USER_KEY);
    
    // اگر در sessionStorage نبود، از localStorage بگیریم
    if (!userStr) {
      userStr = localStorage.getItem(USER_KEY);
    }
    
    // اگر در localStorage هم نبود، از cookie بگیریم
    if (!userStr) {
      const cookies = document.cookie.split(';');
      const userCookie = cookies.find(c => c.trim().startsWith(`${USER_KEY}=`));
      if (userCookie) {
        userStr = decodeURIComponent(userCookie.split('=')[1]);
      }
    }
    
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken: () => {
    // اولویت با sessionStorage
    let token = sessionStorage.getItem(TOKEN_KEY);
    
    if (!token) {
      token = localStorage.getItem(TOKEN_KEY);
    }
    
    if (!token) {
      const cookies = document.cookie.split(';');
      const tokenCookie = cookies.find(c => c.trim().startsWith(`${TOKEN_KEY}=`));
      if (tokenCookie) {
        token = tokenCookie.split('=')[1];
      }
    }
    
    return token;
  },

  isAuthenticated: () => {
    return !!authService.getToken();
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // روش بهتر برای refresh token
  refreshToken: async () => {
    try {
      const refreshToken = sessionStorage.getItem(REFRESH_TOKEN_KEY) || 
                          localStorage.getItem(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', { refreshToken });
      
      if (response.data.token) {
        authService.setToken(response.data.token);
        return response.data.token;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      authService.logout();
      throw error;
    }
  },

  // Helper method to set token
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    sessionStorage.setItem(TOKEN_KEY, token);
    document.cookie = `${TOKEN_KEY}=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Strict`;
  },

  // بررسی اعتبار token
  isTokenValid: (token) => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (error) {
      return false;
    }
  }
};

export default authService;
