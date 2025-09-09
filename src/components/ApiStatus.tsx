import React, { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Wifi, WifiOff, AlertTriangle } from 'lucide-react';
import { apiRequest, API_CONFIG } from '../api/config';

export const ApiStatus: React.FC = () => {
  const [isApiAvailable, setIsApiAvailable] = useState<boolean | null>(null);
  const [lastError, setLastError] = useState<string>('');
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const checkApiStatus = async () => {
      setIsChecking(true);
      try {
        console.log('🔍 Verificando API en:', `${API_CONFIG.BASE_URL}/health`);
        
        const response = await apiRequest('/health');
        console.log('✅ API Response:', response);
        
        setIsApiAvailable(true);
        setLastError('');
      } catch (error) {
        console.log('❌ API Error:', error);
        setIsApiAvailable(false);
        setLastError(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setIsChecking(false);
      }
    };

    checkApiStatus();
    
    // Verificar cada 10 segundos para debugging
    const interval = setInterval(checkApiStatus, 10000);
    
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    console.log('📊 Debug Info:');
    console.log('- API URL:', API_CONFIG.BASE_URL);
    console.log('- Status:', isApiAvailable);
    console.log('- Last Error:', lastError);
    console.log('- Is Checking:', isChecking);
  };

  if (isApiAvailable === null) {
    return (
      <Badge variant="outline" className="flex items-center gap-1">
        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-600"></div>
        Verificando...
      </Badge>
    );
  }

  return (
    <Badge 
      variant={isApiAvailable ? "default" : "destructive"} 
      className="flex items-center gap-1 cursor-pointer"
      onClick={handleClick}
      title={lastError ? `Error: ${lastError}` : ''}
    >
      {isChecking ? (
        <>
          <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
          Verificando
        </>
      ) : isApiAvailable ? (
        <>
          <Wifi className="h-3 w-3" />
          🟢 API MariaDB
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3" />
          🔴 Modo Local
        </>
      )}
    </Badge>
  );
};