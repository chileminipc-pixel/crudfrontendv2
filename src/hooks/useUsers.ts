import { useState, useEffect, useCallback } from 'react';
import { User, CreateUserData, UpdateUserData } from '../types/user';
import { userService } from '../api/userService';

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar usuarios
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await userService.getUsers();
      setUsers(response.users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear usuario
  const createUser = useCallback(async (userData: CreateUserData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.createUser(userData);
      await fetchUsers(); // Recargar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Actualizar usuario
  const updateUser = useCallback(async (userData: UpdateUserData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.updateUser(userData);
      await fetchUsers(); // Recargar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Eliminar usuario
  const deleteUser = useCallback(async (userId: number): Promise<boolean> => {
    setLoading(true);
    setError(null);
    
    try {
      await userService.deleteUser(userId);
      await fetchUsers(); // Recargar lista
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario');
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Obtener usuario por ID
  const getUserById = useCallback((id: number): User | undefined => {
    return users.find(user => user.id === id);
  }, [users]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    getUserById,
    refetch: fetchUsers
  };
};