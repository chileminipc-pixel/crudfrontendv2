import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { API_CONFIG } from '../api/config';

interface DebugInfo {
  apiUrl: string;
  backendRunning: boolean;
  corsEnabled: boolean;
  healthCheck: any;
  localStorage: any;
  environment: string;
}

export const DebugPanel: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const checkDebugInfo = async () => {
    const info: DebugInfo = {
      apiUrl: API_CONFIG.BASE_URL,
      backendRunning: false,
      corsEnabled: false,
      healthCheck: null,
      localStorage: {
        authToken: localStorage.getItem('auth_token'),
        currentUser: localStorage.getItem('current_user'),
        users: JSON.parse(localStorage.getItem('crud_users') || '[]').length
      },
      environment: process.env.NODE_ENV || 'development'
    };

    // Test de conectividad básica
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        info.backendRunning = true;
        info.corsEnabled = true;
        info.healthCheck = await response.json();
      }
    } catch (error) {
      console.log('Debug - Backend no disponible:', error);
    }

    setDebugInfo(info);
  };

  useEffect(() => {
    checkDebugInfo();
  }, []);

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setIsVisible(true)}
        >
          🔧 Debug
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-sm">🔧 Panel de Debug</CardTitle>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-xs">
          <div>
            <div className="font-medium mb-1">🌐 API Configuration</div>
            <div className="text-gray-600">URL: {debugInfo?.apiUrl}</div>
            <div className="text-gray-600">Entorno: {debugInfo?.environment}</div>
          </div>

          <div>
            <div className="font-medium mb-1">🔗 Conectividad</div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant={debugInfo?.backendRunning ? "default" : "destructive"}>
                Backend: {debugInfo?.backendRunning ? "✅" : "❌"}
              </Badge>
              <Badge variant={debugInfo?.corsEnabled ? "default" : "destructive"}>
                CORS: {debugInfo?.corsEnabled ? "✅" : "❌"}
              </Badge>
            </div>
          </div>

          {debugInfo?.healthCheck && (
            <div>
              <div className="font-medium mb-1">💚 Health Check</div>
              <div className="text-gray-600">
                {debugInfo.healthCheck.message}
              </div>
            </div>
          )}

          <div>
            <div className="font-medium mb-1">💾 LocalStorage</div>
            <div className="text-gray-600">
              Token: {debugInfo?.localStorage.authToken ? "Sí" : "No"}
            </div>
            <div className="text-gray-600">
              Usuario: {debugInfo?.localStorage.currentUser ? "Sí" : "No"}
            </div>
            <div className="text-gray-600">
              Usuarios demo: {debugInfo?.localStorage.users || 0}
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={checkDebugInfo}
              className="flex-1"
            >
              🔄 Refresh
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="flex-1"
            >
              🗑️ Clear
            </Button>
          </div>

          <div className="text-xs text-gray-500 pt-2 border-t">
            <div className="font-medium mb-1">📋 Instrucciones:</div>
            <ol className="list-decimal list-inside space-y-1">
              <li>Verificar que el backend esté ejecutándose en puerto 3001</li>
              <li>Comandos: <code>cd backend-config && npm run dev</code></li>
              <li>Si Backend ❌, iniciar servidor Express</li>
              <li>Si CORS ❌, verificar configuración CORS</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};