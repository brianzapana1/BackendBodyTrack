# 🏋️ BodyTrack Backend

Backend completo para la plataforma **BodyTrack** - Sistema integral de gestión de gimnasios y seguimiento de progreso físico.

## 🚀 Tecnologías

- **Node.js** + **Express** (API REST)
- **Prisma ORM** + **PostgreSQL**
- **JWT** (Autenticación)
- **Bcrypt** (Hash de contraseñas)
- **Multer** (Upload de imágenes)

## 📋 Características

### Autenticación y Usuarios
- ✅ Registro de Clientes y Entrenadores
- ✅ Login con JWT (Access + Refresh tokens)
- ✅ **Autenticación segura con HttpOnly cookies**
- ✅ Refresh token automático (15 min access, 7 días refresh)
- ✅ 3 roles: CLIENTE, ENTRENADOR, ADMIN
- ✅ Cambio de contraseña
- ✅ Middleware de autorización por roles

### Clientes
- ✅ Perfil completo con datos personales
- ✅ Planes: BASICO, PREMIUM, PRO
- ✅ Vinculación con usuario autenticado

### Entrenadores
- ✅ Perfil con especialidad y certificaciones
- ✅ Gestión de clientes asignados
- ✅ Estadísticas de rutinas y clientes

### Progreso
- ✅ Registro de medidas corporales (peso, % grasa, medidas)
- ✅ Upload de fotos de progreso (hasta 5 por registro)
- ✅ Historial completo
- ✅ Estadísticas de evolución

### Ejercicios
- ✅ Catálogo de ejercicios
- ✅ Filtros por grupo muscular y equipamiento
- ✅ Videos e imágenes de referencia

### Rutinas
- ✅ Creación de rutinas personalizadas
- ✅ Asignación de ejercicios por día con series/reps
- ✅ Asignación de rutinas a clientes
- ✅ Endpoint `/mi-rutina` para clientes
- ✅ Gestión completa de ejercicios dentro de rutinas

### Foro
- ✅ Posts y comentarios
- ✅ Comunidad entre usuarios
- ✅ Solo autor o admin pueden editar/eliminar

### Suscripciones
- ✅ Gestión de pagos y planes
- ✅ Estados: ACTIVA, CANCELADA, EXPIRADA
- ✅ Verificación automática de expiración
- ✅ Estadísticas de ingresos (Admin)

## 🔧 Instalación y Ejecución

### Opción 1: Docker (Recomendado para equipos) 🐳

La forma más rápida de ejecutar el proyecto con PostgreSQL incluido:

1. **Asegúrate de tener Docker y Docker Compose instalados**
   - [Instalar Docker](https://docs.docker.com/get-docker/)

2. **Clonar el repositorio**
```bash
git clone <repo-url>
cd BackendBodyTrack
```

3. **Configurar variables de entorno (opcional)**
   - El archivo `docker-compose.yml` ya tiene valores por defecto
   - Para personalizar, crea un archivo `.env` con tus valores

4. **Construir y ejecutar con Docker Compose**
```bash
docker-compose up --build
```

Esto hará automáticamente:
- Iniciar PostgreSQL en un contenedor
- Esperar a que la base de datos esté lista
- Generar el cliente de Prisma (`npm run db:gen`)
- Sincronizar el schema con la BD (`npm run db:push`)
- Iniciar el servidor de desarrollo con hot-reload

5. **Verificar que funciona**
```bash
curl http://localhost:4000/health
```

6. **Detener los contenedores**
```bash
docker-compose down
```

Para eliminar también los datos de la BD:
```bash
docker-compose down -v
```

### Opción 2: Instalación Local

Si prefieres ejecutar Node.js y PostgreSQL directamente en tu máquina:

1. **Instalar PostgreSQL** (versión 12 o superior)

2. **Clonar e instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bodytrack"
JWT_SECRET="tu-super-secreto-cambiar-en-produccion"
PORT=4000
```

4. **Aplicar schema a la base de datos**
```bash
npm run db:gen
npm run db:push
```

5. **Iniciar servidor**
```bash
# Desarrollo (con hot-reload)
npm run dev

# Producción
npm start
```

## 📚 Endpoints Principales

### Auth
- `POST /api/auth/registro/cliente` - Registrar cliente
- `POST /api/auth/registro/entrenador` - Registrar entrenador
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Renovar access token (usa refresh token en cookie)
- `POST /api/auth/logout` - Cerrar sesión (limpia refresh token cookie)
- `GET /api/auth/perfil` - Obtener perfil (requiere auth)
- `POST /api/auth/cambiar-password` - Cambiar contraseña

### Clientes
- `GET /api/clientes` - Listar (ENTRENADOR, ADMIN)
- `GET /api/clientes/:id` - Ver detalle
- `PUT /api/clientes/:id` - Actualizar perfil
- `DELETE /api/clientes/:id` - Eliminar (ADMIN)

### Entrenadores
- `GET /api/entrenadores` - Listar todos
- `GET /api/entrenadores/:id` - Ver detalle
- `PUT /api/entrenadores/:id` - Actualizar perfil
- `GET /api/entrenadores/:id/clientes` - Ver clientes asignados
- `GET /api/entrenadores/:id/estadisticas` - Estadísticas

### Progreso
- `GET /api/progreso/cliente/:clienteId` - Historial de progreso
- `GET /api/progreso/:id` - Ver registro específico
- `POST /api/progreso` - Crear registro (con fotos)
- `PUT /api/progreso/:id` - Actualizar registro
- `DELETE /api/progreso/:id` - Eliminar registro
- `GET /api/progreso/cliente/:clienteId/estadisticas` - Estadísticas

### Ejercicios
- `GET /api/ejercicios` - Listar (con filtros)
- `GET /api/ejercicios/grupos-musculares` - Grupos disponibles
- `GET /api/ejercicios/:id` - Ver detalle
- `POST /api/ejercicios` - Crear (ENTRENADOR, ADMIN)
- `PUT /api/ejercicios/:id` - Actualizar
- `DELETE /api/ejercicios/:id` - Eliminar

### Rutinas
- `GET /api/rutinas` - Listar rutinas
- `GET /api/rutinas/mi-rutina` - Ver rutina activa (CLIENTE)
- `GET /api/rutinas/:id` - Ver detalle
- `POST /api/rutinas` - Crear rutina
- `PUT /api/rutinas/:id` - Actualizar
- `DELETE /api/rutinas/:id` - Eliminar
- `POST /api/rutinas/:id/ejercicios` - Agregar ejercicio a rutina
- `PUT /api/rutinas/ejercicios/:ejercicioId` - Actualizar ejercicio
- `DELETE /api/rutinas/ejercicios/:ejercicioId` - Quitar ejercicio
- `POST /api/rutinas/:id/asignar` - Asignar rutina a cliente
- `DELETE /api/rutinas/asignaciones/:id` - Desactivar asignación

### Foro
- `GET /api/foro/posts` - Listar posts
- `GET /api/foro/posts/:id` - Ver post con comentarios
- `POST /api/foro/posts` - Crear post
- `PUT /api/foro/posts/:id` - Actualizar post
- `DELETE /api/foro/posts/:id` - Eliminar post
- `POST /api/foro/posts/:id/comentarios` - Comentar
- `PUT /api/foro/comentarios/:id` - Actualizar comentario
- `DELETE /api/foro/comentarios/:id` - Eliminar comentario

### Suscripciones
- `GET /api/suscripciones/cliente/:clienteId` - Historial
- `GET /api/suscripciones/cliente/:clienteId/activa` - Suscripción activa
- `GET /api/suscripciones/:id` - Ver detalle
- `POST /api/suscripciones` - Crear suscripción
- `POST /api/suscripciones/:id/cancelar` - Cancelar
- `GET /api/suscripciones/estadisticas` - Estadísticas (ADMIN)
- `POST /api/suscripciones/verificar-expiradas` - Verificar expirados (ADMIN)

## 🔐 Autenticación

### Sistema de Autenticación Seguro

El proyecto implementa un sistema de autenticación con **doble token** para máxima seguridad:

#### Access Token (JWT)
- **Duración**: 15 minutos
- **Almacenamiento**: Memoria del navegador (no localStorage)
- **Uso**: Se envía en header `Authorization: Bearer <token>` en cada petición
- **Ventaja**: Si es robado, expira rápido

#### Refresh Token (JWT)
- **Duración**: 7 días
- **Almacenamiento**: Cookie HttpOnly (inaccesible para JavaScript)
- **Uso**: Se envía automáticamente en cookies para renovar access token
- **Seguridad**: 
  - `httpOnly: true` - No accesible vía JavaScript (protección XSS)
  - `sameSite: 'strict'` - Protección contra CSRF
  - `secure: true` en producción - Solo HTTPS

#### Flujo de Autenticación

```
1. Login → Backend genera access token (15 min) + refresh token (7 días)
2. Backend guarda refresh token en cookie HttpOnly
3. Frontend guarda access token en memoria
4. Cada petición usa access token en header Authorization
5. Antes de expirar (14 min), frontend llama /api/auth/refresh automáticamente
6. Backend valida refresh token de la cookie y genera nuevo access token
7. Proceso se repite cada 15 minutos mientras usuario esté activo
```

### Usar la API

Todas las rutas protegidas requieren token JWT en el header:

```
Authorization: Bearer <tu-token-jwt>
```

El frontend debe incluir `withCredentials: true` en peticiones para enviar cookies.

## 📁 Estructura del Proyecto

```
BackendBodyTrack/
├── prisma/
│   └── schema.prisma          # Modelos de base de datos
├── src/
│   ├── config/
│   │   ├── prisma.js          # Cliente de Prisma
│   │   └── multer.js          # Configuración de uploads
│   ├── controllers/           # Controladores por módulo
│   ├── services/              # Lógica de negocio
│   ├── routes/                # Definición de rutas
│   ├── middlewares/           # Auth y manejo de errores
│   └── server.js              # Punto de entrada
├── uploads/                   # Fotos subidas
├── .env.example              # Variables de entorno
└── package.json
```

## 🗃️ Modelos de Base de Datos

- **Usuario** - Autenticación (email, password, rol)
- **Cliente** - Perfil de cliente
- **Entrenador** - Perfil de entrenador
- **RegistroProgreso** - Medidas y fotos del cliente
- **Ejercicio** - Catálogo de ejercicios
- **Rutina** - Planes de entrenamiento
- **RutinaEjercicio** - Ejercicios dentro de rutina
- **AsignacionRutina** - Rutina asignada a cliente
- **ForoPost** - Posts del foro
- **ForoComentario** - Comentarios en posts
- **Suscripcion** - Historial de pagos

## 🧪 Comandos Útiles

```bash
# Desarrollo con hot-reload
npm run dev

# Producción
npm start

# Generar cliente Prisma
npm run db:gen

# Sincronizar schema con DB (desarrollo)
npm run db:push

# Abrir Prisma Studio (GUI de BD)
npm run db:studio

# Docker - Construir y ejecutar
docker-compose up --build

# Docker - Ejecutar en segundo plano
docker-compose up -d

# Docker - Ver logs
docker-compose logs -f app

# Docker - Detener contenedores
docker-compose down

# Docker - Acceder al contenedor de la app
docker-compose exec app sh

# Docker - Ejecutar comandos Prisma dentro del contenedor
docker-compose exec app npm run db:studio
```

## 🗄️ Backup y Restauración de Base de Datos

### Hacer Backup (PostgreSQL)

**Desde Docker:**
```bash
docker-compose exec db pg_dump -U postgres -Fc appdb > backup_$(date +%Y%m%d_%H%M%S).dump
```

**Desde instalación local:**
```bash
pg_dump -h localhost -U postgres -Fc -f backup_$(date +%Y%m%d_%H%M%S).dump bodytrack
```

### Restaurar Backup

**Con Docker:**
```bash
# Detener la app para evitar conexiones activas
docker-compose stop app

# Restaurar
docker-compose exec -T db pg_restore -U postgres -d appdb -c < backup_20241119_150000.dump

# Reiniciar la app
docker-compose start app
```

**Local:**
```bash
pg_restore -h localhost -U postgres -d bodytrack -c backup_20241119_150000.dump
```

### ⚠️ Consideraciones sobre Cambios en el Schema

- **`npm run db:push`** (usado en desarrollo):
  - Sincroniza el schema de Prisma con la base de datos
  - Generalmente **no elimina** datos existentes
  - **Riesgo:** cambios complejos pueden causar pérdidas de datos
  - **Recomendación:** hacer backup antes de cambios importantes

- **Migraciones de Prisma** (recomendado para staging/producción):
  ```bash
  # Crear migración versionada
  npx prisma migrate dev --name descripcion_cambio
  
  # Aplicar migraciones en producción
  npx prisma migrate deploy
  ```

- **Antes de cambios importantes:**
  1. Hacer backup de la BD
  2. Probar cambios en entorno de desarrollo
  3. Revisar SQL generado por migraciones
  4. Aplicar en producción con precaución

## 📝 Probando los Endpoints

### 1. Health Check
```bash
curl http://localhost:4000/health
```

### 2. Ejemplo de Registro y Login

**Registrar Cliente:**
```bash
curl -X POST http://localhost:4000/api/auth/registro/cliente \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "123456",
    "dni": "12345678",
    "nombres": "Juan",
    "apellidos": "Pérez",
    "telefono": "70123456"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@ejemplo.com",
    "password": "123456"
  }'
```

Respuesta:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": "...",
    "email": "juan@ejemplo.com",
    "rol": "CLIENTE",
    "cliente": { ... }
  }
}
```

### 3. Usar el Token para Endpoints Protegidos

Una vez que tengas el token, úsalo en las siguientes peticiones:

```bash
# Obtener perfil
curl http://localhost:4000/api/auth/perfil \
  -H "Authorization: Bearer TU_TOKEN_AQUI"

# Listar clientes (requiere rol ENTRENADOR o ADMIN)
curl http://localhost:4000/api/clientes \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Colección de Postman

Para probar más fácilmente, puedes:
- Importar los endpoints en Postman
- Usar la variable `{{baseUrl}}` = `http://localhost:4000`
- Guardar el token en una variable de entorno para reutilizarlo

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m 'Agregar nueva funcionalidad'`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Abre un Pull Request

## 📄 Licencia

ISC

---

**Desarrollado para el Taller de Sistemas de Información - BodyTrack** 💪
