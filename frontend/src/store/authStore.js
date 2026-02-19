import { create } from 'zustand';
import { authService } from '../services/auth.service';

const useAuthStore = create((set, get) => ({
  user: authService.getCurrentUser(),
  isAuthenticated: authService.isAuthenticated(),
  isLoading: false,
  error: null,
  token: authService.getToken(),

  // Initialize auth state
  initAuth: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    // بررسی اعتبار token
    if (token && authService.isTokenValid(token) && user) {
      set({ 
        user, 
        isAuthenticated: true, 
        token,
        error: null 
      });
    } else {
      // اگر token نامعتبر است، پاک کن
      authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        token: null,
        error: null 
      });
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const data = await authService.login(email, password);
      const token = authService.getToken();
      
      set({ 
        user: data.user, 
        isAuthenticated: true, 
        token,
        isLoading: false,
        error: null 
      });
      
      return data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در ورود';
      set({ 
        error: errorMessage, 
        isLoading: false,
        user: null,
        isAuthenticated: false,
        token: null
      });
      throw error;
    }
  },

  logout: () => {
    authService.logout();
    set({ 
      user: null, 
      isAuthenticated: false, 
      error: null,
      token: null 
    });
  },

  clearError: () => set({ error: null }),

  updateUser: (userData) => {
    const currentUser = get().user;
    const updatedUser = { ...currentUser, ...userData };
    
    // ذخیره کاربر جدید در storage
    localStorage.setItem('royaljeans_user', JSON.stringify(updatedUser));
    sessionStorage.setItem('royaljeans_user', JSON.stringify(updatedUser));
    
    set({ user: updatedUser });
  },

  // به‌روزرسانی token
  updateToken: (newToken) => {
    if (newToken) {
      authService.setToken(newToken);
      set({ token: newToken });
    }
  },

  // بررسی مجدد authentication
  checkAuth: () => {
    const token = authService.getToken();
    const user = authService.getCurrentUser();
    
    if (token && user) {
      set({ 
        isAuthenticated: true,
        user,
        token,
        error: null 
      });
      return true;
    } else {
      authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false, 
        token: null,
        error: null 
      });
      return false;
    }
  }
}));

// Initialize auth state when store is created
if (typeof window !== 'undefined') {
  useAuthStore.getState().initAuth();
}

export default useAuthStore;
