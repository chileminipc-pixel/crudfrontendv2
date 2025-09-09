# ✅ Lista de Verificación para Despliegue

## Antes de Desplegar

### Preparación de archivos ✅
- [x] DebugPanel solo en desarrollo
- [x] URL de API configurada para producción
- [x] CORS configurado para Vercel
- [x] package.json creado para frontend
- [x] vercel.json configurado
- [x] railway.json configurado

## 🛤️ RAILWAY (Backend)

### 1. Cuenta y Repositorio
- [ ] Cuenta creada en [railway.app](https://railway.app)
- [ ] Repositorio conectado con GitHub
- [ ] Proyecto creado en Railway

### 2. Variables de Entorno en Railway
Ir a Railway > tu proyecto > Variables y agregar:
- [ ] `DB_HOST=livesoft.ddns.me`
- [ ] `DB_USER=logisamb`
- [ ] `DB_PASSWORD=Logis_2025.amb`
- [ ] `DB_NAME=new_fadminspa_logisamb_paso`
- [ ] `DB_PORT=3306`
- [ ] `DB_DIALECT=mysql`
- [ ] `JWT_SECRET=mi-super-secreto-jwt-key-2025-logisamb-prod`
- [ ] `NODE_ENV=production`

### 3. Verificación Backend
- [ ] Aplicación desplegada sin errores
- [ ] URL de Railway copiada (ej: `https://tu-app-production.up.railway.app`)
- [ ] Health check funciona: `TU_URL_RAILWAY/api/health`

## 🌐 VERCEL (Frontend)

### 1. Cuenta y Repositorio
- [ ] Cuenta creada en [vercel.com](https://vercel.com)
- [ ] Repositorio conectado con GitHub
- [ ] Proyecto creado en Vercel

### 2. Variables de Entorno en Vercel
Ir a Vercel > tu proyecto > Settings > Environment Variables:
- [ ] `REACT_APP_API_URL` = `TU_URL_RAILWAY/api` (sin barra final)

### 3. Verificación Frontend
- [ ] Aplicación desplegada sin errores
- [ ] URL de Vercel copiada (ej: `https://tu-app.vercel.app`)
- [ ] Aplicación carga correctamente

## 🔗 Conexión Frontend-Backend

### 1. Actualizar CORS
- [ ] Agregar URL de Vercel a variables de Railway:
  - `FRONTEND_URL=https://tu-app.vercel.app`

### 2. Pruebas de Conectividad
- [ ] ApiStatus muestra "🟢 API MariaDB"
- [ ] Login funciona con admin/admin123
- [ ] CRUD de usuarios funciona
- [ ] No hay errores CORS en consola del navegador

## 🎯 URLs Finales

Anota aquí tus URLs finales:
- **Frontend Vercel**: `https://________________.vercel.app`
- **Backend Railway**: `https://________________.up.railway.app`
- **API**: `https://________________.up.railway.app/api`

## 🆘 Si algo falla

### Backend no funciona:
1. Ver logs en Railway > tu proyecto > Deployments
2. Verificar variables de entorno
3. Verificar conexión a MariaDB

### Frontend no conecta:
1. Ver consola del navegador (F12)
2. Verificar variable `REACT_APP_API_URL` en Vercel
3. Verificar CORS en Railway

### Error CORS:
1. Verificar `FRONTEND_URL` en Railway
2. Verificar que la URL de Vercel esté correcta
3. Ver logs de Railway para errores CORS

## 📞 Ayuda

Si necesitas ayuda con algún paso:
1. Copia el error exacto
2. Indica en qué paso estás
3. Comparte las URLs que tienes hasta ahora