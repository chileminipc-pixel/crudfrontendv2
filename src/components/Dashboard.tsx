import React, { useState } from 'react';
import { UserList } from './UserList';
import { UserForm } from './UserForm';
import { User } from '../types/user';
import { Button } from './ui/button';
import { ArrowLeft } from 'lucide-react';

type ViewMode = 'list' | 'create' | 'edit';

export const Dashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const handleCreateUser = () => {
    setSelectedUser(null);
    setViewMode('create');
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setViewMode('edit');
  };

  const handleSave = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const handleCancel = () => {
    setViewMode('list');
    setSelectedUser(null);
  };

  const renderContent = () => {
    switch (viewMode) {
      case 'create':
      case 'edit':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="text-muted-foreground"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a la lista
              </Button>
            </div>
            <UserForm
              user={selectedUser}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        );
      default:
        return (
          <UserList
            onCreateUser={handleCreateUser}
            onEditUser={handleEditUser}
          />
        );
    }
  };

  return <div className="max-w-7xl mx-auto">{renderContent()}</div>;
};