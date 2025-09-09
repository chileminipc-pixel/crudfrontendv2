# 🚀 Guía de Despliegue - Vercel + Railway

## Preparación antes del despliegue

### Paso 1: Remover herramientas de desarrollo

Primero vamos a quitar el DebugPanel para producción, ya que solo es útil en desarrollo.

### Paso 2: Configurar variables de entorno para producción

Necesitamos configurar las URLs correctas para que el frontend se conecte al backend en Railway.

## 🛤️ PARTE 1: Desplegar Backend en Railway

### 1.1 Crear cuenta en Railway
1. Ve a [railway.app](https://railway.app)
2. Haz clic en "Login" y conecta con GitHub
3. Autoriza Railway a acceder a tus repositorios

### 1.2 Preparar el backend para Railway
1. Crea un archivo `package.json` en la raíz del proyecto (no en backend-config)
2. Crea archivos de configuración específicos para Railway

### 1.3 Desplegar en Railway
1. En Railway, haz clic en "New Project"
2. Selecciona "Deploy from GitHub repo"
3. Busca y selecciona tu repositorio
4. Railway detectará automáticamente que es una app Node.js

### 1.4 Configurar variables de entorno en Railway
En el dashboard de Railway:
1. Ve a la pestaña "Variables"
2. Agrega estas variables una por una:
   - `DB_HOST=livesoft.ddns.me`
   - `DB_USER=logisamb`
   - `DB_PASSWORD=Logis_2025.amb`
   - `DB_NAME=new_fadminspa_logisamb_paso`
   - `DB_PORT=3306`
   - `DB_DIALECT=mysql`
   - `JWT_SECRET=mi-super-secreto-jwt-key-2025-logisamb-prod`
   - `NODE_ENV=production`
   - `PORT=3000` (Railway usa puerto 3000 automáticamente)

### 1.5 Configurar dominio personalizado (opcional)
1. En Railway, ve a "Settings" > "Domains"
2. Railway te dará una URL como: `https://tu-app-production.up.railway.app`
3. Copia esta URL, la necesitarás para Vercel

## 🌐 PARTE 2: Desplegar Frontend en Vercel

### 2.1 Crear cuenta en Vercel
1. Ve a [vercel.com](https://vercel.com)
2. Haz clic en "Sign Up" y conecta con GitHub
3. Autoriza Vercel a acceder a tus repositorios

### 2.2 Preparar el frontend para Vercel
1. Crear archivo de configuración `vercel.json`
2. Configurar la URL del backend de Railway

### 2.3 Desplegar en Vercel
1. En Vercel, haz clic en "New Project"
2. Busca y selecciona tu repositorio
3. Vercel detectará automáticamente que es una app React

### 2.4 Configurar variables de entorno en Vercel
En el dashboard de Vercel:
1. Ve a "Settings" > "Environment Variables"
2. Agrega esta variable:
   - `REACT_APP_API_URL` = URL de Railway (ej: `https://tu-app-production.up.railway.app/api`)

### 2.5 Configurar dominio (Vercel te da uno automático)
Vercel te dará una URL como: `https://tu-app.vercel.app`

## 🔄 PARTE 3: Conectar Frontend con Backend

### 3.1 Actualizar CORS en Railway
El backend necesita permitir requests desde tu dominio de Vercel.

### 3.2 Probar la conexión
1. Ve a tu app en Vercel
2. Verifica que el ApiStatus muestre "🟢 API MariaDB"
3. Prueba el login con admin/admin123

## ✅ Checklist de Verificación

### Backend (Railway):
- [ ] Aplicación desplegada sin errores
- [ ] Variables de entorno configuradas
- [ ] Base de datos MariaDB conectada
- [ ] Health check responde en `/api/health`

### Frontend (Vercel):
- [ ] Aplicación desplegada sin errores
- [ ] Variable de entorno `REACT_APP_API_URL` configurada
- [ ] ApiStatus muestra conexión exitosa
- [ ] Login funciona correctamente

## 🆘 Troubleshooting Común

### Error: "API_UNAVAILABLE"
- Verificar que la URL de Railway esté correcta en Vercel
- Verificar variables de entorno en ambos servicios

### Error: CORS
- Verificar configuración CORS en backend
- Verificar que la URL de Vercel esté permitida

### Error: Base de datos
- Verificar credenciales de MariaDB en Railway
- Verificar que `livesoft.ddns.me` sea accesible desde Railway

## 📱 URLs Finales

Después del despliegue tendrás:
- **Frontend**: `https://tu-app.vercel.app`
- **Backend**: `https://tu-app-production.up.railway.app`
- **API**: `https://tu-app-production.up.railway.app/api`

## 🎯 Resultado Final

Una aplicación completamente funcional en la nube:
- ✅ Frontend React profesional en Vercel
- ✅ Backend Express seguro en Railway  
- ✅ Base de datos MariaDB en tu servidor
- ✅ Autenticación JWT funcionando
- ✅ Sistema CRUD completo
- ✅ Accesible desde cualquier lugar del mundo