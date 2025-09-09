import { User, CreateUserData, UpdateUserData } from '../types/user';
import { apiRequest, API_ENDPOINTS } from './config';

interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  rol?: string;
  activo?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

interface GetUsersResponse {
  users: User[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

// Fallback user service usando localStorage
const localUserService = {
  getUsers: (params: GetUsersParams = {}): GetUsersResponse => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    let filteredUsers = [...users];

    // Aplicar filtros
    if (params.search) {
      const search = params.search.toLowerCase();
      filteredUsers = filteredUsers.filter(user =>
        user.nombre.toLowerCase().includes(search) ||
        user.login.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search)
      );
    }

    if (params.rol && ['1', '2'].includes(params.rol)) {
      filteredUsers = filteredUsers.filter(user => user.rol === parseInt(params.rol!));
    }

    if (params.activo && ['true', 'false'].includes(params.activo)) {
      filteredUsers = filteredUsers.filter(user => user.activo === (params.activo === 'true'));
    }

    // Ordenar
    const sortBy = params.sortBy || 'creacion';
    const sortOrder = params.sortOrder || 'DESC';
    filteredUsers.sort((a: any, b: any) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      if (sortOrder === 'ASC') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Paginación
    const page = params.page || 1;
    const limit = params.limit || 10;
    const offset = (page - 1) * limit;
    const paginatedUsers = filteredUsers.slice(offset, offset + limit);

    return {
      users: paginatedUsers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(filteredUsers.length / limit),
        totalItems: filteredUsers.length,
        itemsPerPage: limit,
        hasNextPage: page < Math.ceil(filteredUsers.length / limit),
        hasPrevPage: page > 1
      }
    };
  },

  getUserById: (id: number): User => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    const user = users.find((u: User) => u.id === id);
    if (!user) throw new Error('Usuario no encontrado');
    return user;
  },

  createUser: (userData: CreateUserData): User => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    
    // Validar unicidad
    if (users.some((u: User) => u.login === userData.login)) {
      throw new Error('El login ya está en uso');
    }
    if (users.some((u: User) => u.email === userData.email)) {
      throw new Error('El email ya está en uso');
    }

    const newUser: User = {
      id: Math.max(0, ...users.map((u: User) => u.id)) + 1,
      nombre: userData.nombre,
      login: userData.login,
      email: userData.email,
      pwd: btoa(userData.pwd), // Simple encoding for demo
      idEmpresa: userData.idEmpresa,
      activo: true,
      creacion: new Date().toISOString(),
      modificacion: new Date().toISOString(),
      rol: userData.rol
    };

    users.push(newUser);
    localStorage.setItem('crud_users', JSON.stringify(users));
    return newUser;
  },

  updateUser: (userData: UpdateUserData): User => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    const userIndex = users.findIndex((u: User) => u.id === userData.id);
    
    if (userIndex === -1) throw new Error('Usuario no encontrado');

    // Validar unicidad (excluyendo el usuario actual)
    if (userData.login && users.some((u: User, index: number) => 
      u.login === userData.login && index !== userIndex)) {
      throw new Error('El login ya está en uso');
    }
    if (userData.email && users.some((u: User, index: number) => 
      u.email === userData.email && index !== userIndex)) {
      throw new Error('El email ya está en uso');
    }

    const updatedUser = {
      ...users[userIndex],
      ...userData,
      pwd: userData.pwd ? btoa(userData.pwd) : users[userIndex].pwd,
      modificacion: new Date().toISOString()
    };

    users[userIndex] = updatedUser;
    localStorage.setItem('crud_users', JSON.stringify(users));
    return updatedUser;
  },

  deleteUser: (id: number): void => {
    const users = JSON.parse(localStorage.getItem('crud_users') || '[]');
    const filteredUsers = users.filter((u: User) => u.id !== id);
    localStorage.setItem('crud_users', JSON.stringify(filteredUsers));
  }
};

export const userService = {
  // Obtener lista de usuarios
  getUsers: async (params: GetUsersParams = {}): Promise<GetUsersResponse> => {
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const url = `${API_ENDPOINTS.USERS}?${queryParams.toString()}`;
      const response = await apiRequest(url);

      if (response.success && response.data) {
        return response.data;
      }

      throw new Error(response.message || 'Error al obtener usuarios');
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        return localUserService.getUsers(params);
      }
      console.error('Get users error:', error);
      throw error;
    }
  },

  // Obtener usuario por ID
  getUserById: async (id: number): Promise<User> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(id));

      if (response.success && response.data) {
        return response.data.user;
      }

      throw new Error(response.message || 'Usuario no encontrado');
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        return localUserService.getUserById(id);
      }
      console.error('Get user by ID error:', error);
      throw error;
    }
  },

  // Crear usuario
  createUser: async (userData: CreateUserData): Promise<User> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USERS, {
        method: 'POST',
        body: JSON.stringify(userData)
      });

      if (response.success && response.data) {
        return response.data.user;
      }

      // Manejar errores de validación
      if (response.errors) {
        const errorMessage = response.errors
          .map((err: any) => err.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      throw new Error(response.message || 'Error al crear usuario');
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        return localUserService.createUser(userData);
      }
      console.error('Create user error:', error);
      throw error;
    }
  },

  // Actualizar usuario
  updateUser: async (userData: UpdateUserData): Promise<User> => {
    try {
      const { id, ...updateData } = userData;
      
      const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(id), {
        method: 'PUT',
        body: JSON.stringify(updateData)
      });

      if (response.success && response.data) {
        return response.data.user;
      }

      // Manejar errores de validación
      if (response.errors) {
        const errorMessage = response.errors
          .map((err: any) => err.message)
          .join(', ');
        throw new Error(errorMessage);
      }

      throw new Error(response.message || 'Error al actualizar usuario');
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        return localUserService.updateUser(userData);
      }
      console.error('Update user error:', error);
      throw error;
    }
  },

  // Eliminar usuario
  deleteUser: async (id: number): Promise<void> => {
    try {
      const response = await apiRequest(API_ENDPOINTS.USER_BY_ID(id), {
        method: 'DELETE'
      });

      if (!response.success) {
        throw new Error(response.message || 'Error al eliminar usuario');
      }
    } catch (error) {
      if (error instanceof Error && error.message === 'API_UNAVAILABLE') {
        console.warn('API unavailable, using localStorage fallback');
        localUserService.deleteUser(id);
        return;
      }
      console.error('Delete user error:', error);
      throw error;
    }
  }
};