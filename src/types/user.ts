export interface User {
  id: number;
  nombre: string;
  login: string;
  email: string;
  pwd: string;
  idEmpresa: number;
  activo: boolean;
  creacion: string;
  modificacion: string;
  rol: 1 | 2; // 1 = superusuario, 2 = usuario normal
}

export interface CreateUserData {
  nombre: string;
  login: string;
  email: string;
  pwd: string;
  idEmpresa: number;
  rol: 1 | 2;
}

export interface UpdateUserData extends Partial<CreateUserData> {
  id: number;
  activo?: boolean;
}

export interface LoginCredentials {
  login: string;
  password: string;
}

export interface AuthUser {
  id: number;
  nombre: string;
  login: string;
  email: string;
  rol: 1 | 2;
  idEmpresa: number;
}