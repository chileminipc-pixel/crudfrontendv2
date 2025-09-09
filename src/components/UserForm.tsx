import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { User, CreateUserData, UpdateUserData } from '../types/user';
import { useUsers } from '../hooks/useUsers';
import { Eye, EyeOff, Save, X } from 'lucide-react';

interface UserFormProps {
  user?: User | null;
  onSave: () => void;
  onCancel: () => void;
}

export const UserForm: React.FC<UserFormProps> = ({ user, onSave, onCancel }) => {
  const { createUser, updateUser, loading, error } = useUsers();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    login: '',
    email: '',
    pwd: '',
    idEmpresa: 1,
    rol: 2 as 1 | 2,
    activo: true
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const isEditing = !!user;

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        login: user.login,
        email: user.email,
        pwd: '', // No mostrar contraseña existente
        idEmpresa: user.idEmpresa,
        rol: user.rol,
        activo: user.activo
      });
    }
  }, [user]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      errors.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar login
    if (!formData.login.trim()) {
      errors.login = 'El login es requerido';
    } else if (formData.login.trim().length < 3) {
      errors.login = 'El login debe tener al menos 3 caracteres';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.login)) {
      errors.login = 'El login solo puede contener letras, números y guiones bajos';
    }

    // Validar email
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }

    // Validar contraseña (solo para usuarios nuevos o si se está cambiando)
    if (!isEditing || formData.pwd) {
      if (!formData.pwd) {
        errors.pwd = 'La contraseña es requerida';
      } else if (formData.pwd.length < 6) {
        errors.pwd = 'La contraseña debe tener al menos 6 caracteres';
      }
    }

    // Validar empresa
    if (!formData.idEmpresa || formData.idEmpresa < 1) {
      errors.idEmpresa = 'Debe seleccionar una empresa válida';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    let success = false;

    if (isEditing && user) {
      const updateData: UpdateUserData = {
        id: user.id,
        nombre: formData.nombre.trim(),
        login: formData.login.trim(),
        email: formData.email.trim(),
        idEmpresa: formData.idEmpresa,
        rol: formData.rol,
        activo: formData.activo
      };

      // Solo incluir contraseña si se ha ingresado una nueva
      if (formData.pwd) {
        updateData.pwd = formData.pwd;
      }

      success = await updateUser(updateData);
    } else {
      const createData: CreateUserData = {
        nombre: formData.nombre.trim(),
        login: formData.login.trim(),
        email: formData.email.trim(),
        pwd: formData.pwd,
        idEmpresa: formData.idEmpresa,
        rol: formData.rol
      };

      success = await createUser(createData);
    }

    if (success) {
      onSave();
      // Limpiar formulario si es creación
      if (!isEditing) {
        setFormData({
          nombre: '',
          login: '',
          email: '',
          pwd: '',
          idEmpresa: 1,
          rol: 2,
          activo: true
        });
      }
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo al modificarlo
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditing ? `Editar Usuario: ${user?.nombre}` : 'Crear Nuevo Usuario'}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre Completo</Label>
              <Input
                id="nombre"
                type="text"
                placeholder="Ej: Juan Pérez"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                className={formErrors.nombre ? 'border-red-500' : ''}
              />
              {formErrors.nombre && (
                <p className="text-sm text-red-500">{formErrors.nombre}</p>
              )}
            </div>

            {/* Login */}
            <div className="space-y-2">
              <Label htmlFor="login">Login</Label>
              <Input
                id="login"
                type="text"
                placeholder="Ej: jperez"
                value={formData.login}
                onChange={(e) => handleChange('login', e.target.value)}
                className={formErrors.login ? 'border-red-500' : ''}
              />
              {formErrors.login && (
                <p className="text-sm text-red-500">{formErrors.login}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="usuario@empresa.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className={formErrors.email ? 'border-red-500' : ''}
              />
              {formErrors.email && (
                <p className="text-sm text-red-500">{formErrors.email}</p>
              )}
            </div>

            {/* Contraseña */}
            <div className="space-y-2">
              <Label htmlFor="pwd">
                {isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña'}
              </Label>
              <div className="relative">
                <Input
                  id="pwd"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={isEditing ? 'Dejar vacío para mantener actual' : 'Mínimo 6 caracteres'}
                  value={formData.pwd}
                  onChange={(e) => handleChange('pwd', e.target.value)}
                  className={`pr-10 ${formErrors.pwd ? 'border-red-500' : ''}`}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1 h-8 w-8 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {formErrors.pwd && (
                <p className="text-sm text-red-500">{formErrors.pwd}</p>
              )}
            </div>

            {/* ID Empresa */}
            <div className="space-y-2">
              <Label htmlFor="idEmpresa">ID Empresa</Label>
              <Input
                id="idEmpresa"
                type="number"
                placeholder="1"
                min="1"
                value={formData.idEmpresa}
                onChange={(e) => handleChange('idEmpresa', parseInt(e.target.value) || 1)}
                className={formErrors.idEmpresa ? 'border-red-500' : ''}
              />
              {formErrors.idEmpresa && (
                <p className="text-sm text-red-500">{formErrors.idEmpresa}</p>
              )}
            </div>

            {/* Rol */}
            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select 
                value={formData.rol.toString()} 
                onValueChange={(value) => handleChange('rol', parseInt(value) as 1 | 2)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Superusuario</SelectItem>
                  <SelectItem value="2">Usuario Normal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Estado activo (solo en edición) */}
          {isEditing && (
            <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
              <Switch
                id="activo"
                checked={formData.activo}
                onCheckedChange={(checked) => handleChange('activo', checked)}
              />
              <Label htmlFor="activo" className="cursor-pointer">
                Usuario activo
              </Label>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              <Save className="w-4 h-4 mr-2" />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};