# 🔧 Guía de Diagnóstico - Conexión MariaDB

## ✅ Paso 1: Verificar que el Backend esté ejecutándose

```bash
# 1. Abrir una nueva terminal
# 2. Navegar a la carpeta del backend
cd backend-config

# 3. Instalar dependencias (solo la primera vez)
npm install

# 4. Iniciar el servidor
npm run dev
```

**¿Ves estos mensajes?**
```
✅ Base de datos sincronizada correctamente.
✅ Usuario administrador creado: admin / admin123
🚀 Servidor iniciado en puerto 3001
📋 Health Check: http://localhost:3001/api/health
```

## ✅ Paso 2: Verificar conectividad manualmente

Abre tu navegador y ve a: `http://localhost:3001/api/health`

**Deberías ver:**
```json
{
  "success": true,
  "message": "API funcionando correctamente",
  "timestamp": "2025-01-...",
  "environment": "development"
}
```

## ✅ Paso 3: Usar el Panel de Debug

1. En tu aplicación React, busca el botón **🔧 Debug** en la esquina inferior derecha
2. Haz clic para abrir el panel
3. Verifica que muestre:
   - Backend: ✅
   - CORS: ✅
   - Health Check visible

## ✅ Paso 4: Verificar la conexión a MariaDB

Si el backend está corriendo pero no se conecta a MariaDB, verifica:

```bash
# En la terminal del backend, busca estos errores:
❌ Error al inicializar base de datos: Error: getaddrinfo ENOTFOUND livesoft.ddns.me
❌ Error de conexión: Access denied for user 'logisamb'@'...'
```

## 🔄 Soluciones Comunes:

### Problema: Backend no inicia
```bash
cd backend-config
rm -rf node_modules
npm install
npm run dev
```

### Problema: Error de conexión a MariaDB
1. Verificar que `livesoft.ddns.me` sea accesible
2. Verificar credenciales en `/backend-config/.env`
3. Verificar que el puerto 3306 esté abierto

### Problema: CORS Error
- El backend ya está configurado para CORS
- Verificar que `FRONTEND_URL=http://localhost:3000` en `.env`

## 🎯 Resultado Esperado:

Cuando todo funcione correctamente:
- Panel Debug: Backend ✅, CORS ✅
- ApiStatus: 🟢 API MariaDB
- Login usa la base de datos real en lugar de localStorage

## 📞 Si sigues teniendo problemas:

1. Abre la consola del navegador (F12)
2. Busca errores en rojo
3. Comparte los logs del backend y del navegador