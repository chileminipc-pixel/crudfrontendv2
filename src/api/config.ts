// Configuración de la API
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || 'crudbackv2-production.up.railway.app'  // URL de producción Railway
    : 'http://localhost:3001/api',      // URL de desarrollo
  TIMEOUT: 10000, // 10 segundos
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

// Endpoints de la API
export const API_ENDPOINTS = {
  // Autenticación
  LOGIN: '/auth/login',
  CURRENT_USER: '/auth/me',
  
  // Usuarios
  USERS: '/users',
  USER_BY_ID: (id: number | string) => `/users/${id}`
};

// Función para obtener headers con token
export const getAuthHeaders = (): Record<string, string> => {
  const token = localStorage.getItem('auth_token');
  return {
    ...API_CONFIG.HEADERS,
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Función para manejar respuestas de la API
export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
  }
  return response.json();
};

// Función para hacer requests a la API con fallback
export const apiRequest = async (
  url: string, 
  options: RequestInit = {}
): Promise<any> => {
  const fullUrl = `${API_CONFIG.BASE_URL}${url}`;
  
  const config: RequestInit = {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...options.headers
    }
  };

  try {
    // Intentar conectar con timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);
    
    const response = await fetch(fullUrl, {
      ...config,
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    return await handleApiResponse(response);
  } catch (error) {
    console.warn('API Request failed, falling back to localStorage:', error);
    throw new Error('API_UNAVAILABLE');
  }
};