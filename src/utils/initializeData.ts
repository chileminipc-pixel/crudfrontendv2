import { User } from '../types/user';

const USERS_KEY = 'crud_users';

// Datos iniciales de usuarios para demostración
const initialUsers: User[] = [
  {
    id: 1,
    nombre: 'Super Administrador',
    login: 'admin',
    email: 'admin@empresa.com',
    pwd: btoa('admin123'), // Simple encoding: admin123
    idEmpresa: 1,
    activo: true,
    creacion: new Date('2024-01-01').toISOString(),
    modificacion: new Date('2024-01-01').toISOString(),
    rol: 1
  },
  {
    id: 2,
    nombre: 'Juan Pérez',
    login: 'jperez',
    email: 'juan.perez@empresa.com',
    pwd: btoa('usuario123'), // Simple encoding: usuario123
    idEmpresa: 1,
    activo: true,
    creacion: new Date('2024-01-15').toISOString(),
    modificacion: new Date('2024-01-15').toISOString(),
    rol: 2
  },
  {
    id: 3,
    nombre: 'María García',
    login: 'mgarcia',
    email: 'maria.garcia@empresa.com',
    pwd: btoa('usuario123'), // Simple encoding: usuario123
    idEmpresa: 1,
    activo: true,
    creacion: new Date('2024-02-01').toISOString(),
    modificacion: new Date('2024-02-01').toISOString(),
    rol: 2
  },
  {
    id: 4,
    nombre: 'Carlos López',
    login: 'clopez',
    email: 'carlos.lopez@empresa.com',
    pwd: btoa('usuario123'), // Simple encoding: usuario123
    idEmpresa: 1,
    activo: false,
    creacion: new Date('2024-02-15').toISOString(),
    modificacion: new Date('2024-02-20').toISOString(),
    rol: 2
  },
  {
    id: 5,
    nombre: 'Ana Martínez',
    login: 'amartinez',
    email: 'ana.martinez@empresa.com',
    pwd: btoa('usuario123'), // Simple encoding: usuario123
    idEmpresa: 2,
    activo: true,
    creacion: new Date('2024-03-01').toISOString(),
    modificacion: new Date('2024-03-01').toISOString(),
    rol: 2
  }
];

// Función para inicializar datos si no existen
export const initializeData = () => {
  const existingUsers = localStorage.getItem(USERS_KEY);
  
  if (!existingUsers) {
    localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
    console.log('📊 Datos iniciales cargados');
    console.log('🔑 Usuario admin: admin / admin123');
    console.log('👤 Usuarios de prueba creados');
  }
};

// Función para resetear datos (útil para desarrollo)
export const resetData = () => {
  localStorage.setItem(USERS_KEY, JSON.stringify(initialUsers));
  localStorage.removeItem('auth_token');
  localStorage.removeItem('current_user');
  console.log('🔄 Datos reseteados');
};

// Exportar datos iniciales para referencia
export { initialUsers };