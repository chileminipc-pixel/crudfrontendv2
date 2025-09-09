import { AuthUser, LoginCredentials } from '../types/user';
import { apiRequest, API_ENDPOINTS } from './config';

// Fallback auth service usando localStorage
const localAuthService = {
  login: (credentials: LoginCredentials): { user: AuthUser; token: string } | null => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    const user = users.find((u: any) => 
      u.login === credentials.login && 
      u.pwd === btoa(credentials.password) && // Simple encoding for demo
      u.activo === true
    );

    if (user && user.rol === 1) {
      const token = `local_token_${user.id}_${Date.now()}`;
      localStorage.setItem('auth_token', token);
      localStorage.setItem('current_user', JSON.stringify(user));
      return { user, token };
    }
    return null;
  },

  getCurrentUser: (): AuthUser | null => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('current_user');
    
    if (!token || !userStr) return null;
    
    try {
      return JSON.parse(userStr);
    } catch {
      return null;
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('current_user');
  }
};

export const authService = {
  // Login
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string } | null> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.LOGIN, {
        method: 'POST',
        body: JSON.stringify(credentials)
      });

      if (response.success && response.data) {
        const { user, token } = response.data;
        localStorage.setItem('auth_token', token);
        localStorage.setItem('current_user', JSON.stringify(user));
        return { user, token };
      }
      
      return null;
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        return localAuthService.login(credentials);
      }
      console.error('Login error:', error);
      return null;
    }
  },

  // Logout
  logout: () => {
    localAuthService.logout();
  },

  // Obtener usuario actual
  getCurrentUser: async (): Promise<AuthUser | null> => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      // Si el token es local, usar fallback
      if (token.startsWith('local_token_')) {
        return localAuthService.getCurrentUser();
      }

      const response = await apiRequest(API_ENDPOINTS.CURRENT_USER);
      
      if (response.success && response.data) {
        return response.data.user;
      }
      
      // Token inválido, limpiar
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      return null;
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        return localAuthService.getCurrentUser();
      }
      console.error('Get current user error:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('current_user');
      return null;
    }
  }
};