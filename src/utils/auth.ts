import { AuthUser, LoginCredentials } from '../types/user';

// Simulación de encriptación (en el backend real usarías bcrypt)
const hashPassword = (password: string): string => {
  return btoa(password + 'salt_key_2025'); // Solo para demo
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// JWT simulado (en el backend real usarías jsonwebtoken)
const generateToken = (user: AuthUser): string => {
  const tokenData = {
    id: user.id,
    login: user.login,
    rol: user.rol,
    exp: Date.now() + 24 * 60 * 60 * 1000 // 24 horas
  };
  return btoa(JSON.stringify(tokenData));
};

const verifyToken = (token: string): AuthUser | null => {
  try {
    const tokenData = JSON.parse(atob(token));
    if (tokenData.exp < Date.now()) {
      return null; // Token expirado
    }
    // En una app real, aquí verificarías la firma del JWT
    return {
      id: tokenData.id,
      nombre: '', // Se completaría desde la base de datos
      login: tokenData.login,
      email: '',
      rol: tokenData.rol,
      idEmpresa: 1
    };
  } catch {
    return null;
  }
};

// Datos de usuarios simulados (en la app real vendrían de MariaDB)
const mockUsers = [
  {
    id: 1,
    nombre: 'Super Admin',
    login: 'admin',
    email: 'admin@empresa.com',
    pwd: hashPassword('admin123'), // Contraseña: admin123
    idEmpresa: 1,
    activo: true,
    creacion: '2024-01-01T00:00:00Z',
    modificacion: '2024-01-01T00:00:00Z',
    rol: 1 as const
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    login: 'jperez',
    email: 'juan.perez@empresa.com',
    pwd: hashPassword('user123'), // Contraseña: user123
    idEmpresa: 1,
    activo: true,
    creacion: '2024-01-15T10:30:00Z',
    modificacion: '2024-01-20T15:45:00Z',
    rol: 2 as const
  },
  {
    id: 3,
    nombre: 'María García',
    login: 'mgarcia',
    email: 'maria.garcia@empresa.com',
    pwd: hashPassword('user456'),
    idEmpresa: 1,
    activo: false,
    creacion: '2024-02-01T09:15:00Z',
    modificacion: '2024-02-01T09:15:00Z',
    rol: 2 as const
  }
];

// Simular localStorage como base de datos
const USERS_KEY = 'crud_users';
const TOKEN_KEY = 'auth_token';

export const authService = {
  // Inicializar datos si no existen
  initializeData: () => {
    if (!localStorage.getItem(USERS_KEY)) {
      localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
    }
  },

  // Login
  login: async (credentials: LoginCredentials): Promise<{ user: AuthUser; token: string } | null> => {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u: any) => u.login === credentials.login && u.activo);
    
    if (user && verifyPassword(credentials.password, user.pwd)) {
      const authUser: AuthUser = {
        id: user.id,
        nombre: user.nombre,
        login: user.login,
        email: user.email,
        rol: user.rol,
        idEmpresa: user.idEmpresa
      };
      const token = generateToken(authUser);
      localStorage.setItem(TOKEN_KEY, token);
      return { user: authUser, token };
    }
    return null;
  },

  // Logout
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Verificar autenticación actual
  getCurrentUser: (): AuthUser | null => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    
    const tokenUser = verifyToken(token);
    if (!tokenUser) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    // Obtener datos completos del usuario
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const fullUser = users.find((u: any) => u.id === tokenUser.id && u.activo);
    
    if (!fullUser) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }

    return {
      id: fullUser.id,
      nombre: fullUser.nombre,
      login: fullUser.login,
      email: fullUser.email,
      rol: fullUser.rol,
      idEmpresa: fullUser.idEmpresa
    };
  }
};

export { hashPassword, verifyPassword };