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
- ✅ Login con JWT
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

## 🔧 Instalación

1. **Clonar e instalar dependencias**
```bash
npm install
```

2. **Configurar variables de entorno**
```bash
cp .env.example .env
```

Edita `.env` con tus datos:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/bodytrack"
JWT_SECRET="tu-super-secreto-cambiar-en-produccion"
PORT=4000
```

3. **Aplicar schema a la base de datos**
```bash
npm run db:push
```

4. **Iniciar servidor**
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

Todas las rutas (excepto registro y login) requieren token JWT en el header:

```
Authorization: Bearer <tu-token-jwt>
```

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

# Sincronizar schema con DB
npm run db:push

# Abrir Prisma Studio (GUI de BD)
npm run db:studio
```

## 📝 Ejemplo de Registro y Login

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
