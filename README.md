Backend – Node.js + Express + Prisma (PostgreSQL)
Repositorio base para un backend modular en JavaScript puro con Express, Prisma ORM y PostgreSQL, 
ejecutado en desarrollo con vite-node (hot reload rápido). Estructura pensada para crecer de forma 
ordenada: config/, controllers/, middlewares/, routes/, services/, utils/, prisma/, uploads/.

🧱 Stack
- Runtime: Node.js (ESM)
- Framework: Express
- ORM: Prisma (PostgreSQL)
- Dev runner: vite-node (Vite)
- Variables de entorno: dotenv
- CORS: habilitado para desarrollo

📂 Estructura del proyecto
```bash
backend/
├─ prisma/
│  ├─ migrations/
│  └─ schema.prisma
├─ src/
│  ├─ config/
│  │  └─ prisma.js
│  ├─ controllers/
│  │  └─ clientes.controller.js
│  ├─ middlewares/
│  │  └─ error.js
│  ├─ routes/
│  │  ├─ clientes.routes.js
│  │  └─ index.js
│  ├─ services/
│  │  └─ clientes.service.js
│  ├─ utils/
│  └─ server.js
├─ uploads/
├─ .env
├─ .gitignore
├─ package.json
└─ README.md
```


✅ Requisitos
- Node.js ≥ 18
- npm ≥ 10
- PostgreSQL instalado y corriendo
- Una base de datos creada (ej: appdb) y credenciales válidas
⚙️ Variables de entorno
Crea un archivo .env en la raíz con al menos:

PORT=4000
DATABASE_URL="postgresql://USER:PASS@HOST:5432/appdb?schema=public"

Ejemplo:
postgresql://postgres:1234@localhost:5432/appdb?schema=public
🚀 Instalación y ejecución
1) Instalar dependencias:
   npm install

2) Generar cliente de Prisma:
   npm run db:gen

3) Crear/actualizar tablas:
   npm run db:push

4) Iniciar el servidor en desarrollo:
   npm run dev

5) Iniciar en producción:
   npm start


   
🔌 Endpoints disponibles

Endpoint de prueba: http://localhost:4000/api/clientes

- GET /health → Verifica el estado del servidor
- GET /api/clientes → Lista todos los clientes
- GET /api/clientes/:id → Obtiene un cliente por ID
- POST /api/clientes → Crea un nuevo cliente
- PUT /api/clientes/:id → Actualiza un cliente completo
- PATCH /api/clientes/:id → Actualiza campos parciales
- DELETE /api/clientes/:id → Elimina un cliente

  
🗃️ Prisma – flujo de trabajo
A) Crear o editar modelos:
- Edita prisma/schema.prisma.
- Ejecuta npm run db:gen para regenerar el cliente.
- Ejecuta npm run db:push para sincronizar los modelos con la BD.

B) Migraciones versionadas (recomendado):
- npx prisma migrate dev --name nombre_migracion
- npx prisma migrate deploy

C) Visualización de datos:
- npm run db:studio → abre Prisma Studio en navegador.
➕ Añadir una nueva tabla o modelo
1. Editar prisma/schema.prisma agregando un nuevo modelo.
2. Ejecutar npm run db:gen para generar el cliente.
3. Crear la tabla con npm run db:push o con migración versionada:
   npx prisma migrate dev --name add_nueva_tabla
4. Crear los archivos:
   - src/services/nueva_tabla.service.js
   - src/controllers/nueva_tabla.controller.js
   - src/routes/nueva_tabla.routes.js y agregarla al index.js
5. Probar los endpoints con Postman.

   
🧪 Postman y pruebas
Puedes importar una colección con las siguientes rutas básicas:

```bash
GET    /api/clientes
GET    /api/clientes/:id
POST   /api/clientes
PUT    /api/clientes/:id
PATCH  /api/clientes/:id
DELETE /api/clientes/:id

```
Usa el header 'Content-Type: application/json' para las solicitudes POST/PUT/PATCH.


🧰 Scripts útiles
dev: vite-node src/server.js
start: node src/server.js
db:gen: prisma generate
db:push: prisma db push
db:studio: prisma studio
db:migrate: prisma migrate dev --name init
db:deploy: prisma migrate deploy


🛡️ Errores y manejo global
- Middleware notFound: devuelve 404 si la ruta no existe.
- Middleware errorHandler: captura excepciones no controladas y responde con JSON.
- Agregar validación de entrada con Zod o Joi.
 
    
🐳 Docker (En un futuro)


🧯 Troubleshooting
- ERR_MODULE_NOT_FOUND: revisa que los imports tengan la extensión .js y ruta correcta.
- vite-node no arranca: evita rutas con espacios o caracteres especiales.
- Prisma no conecta: revisa tu DATABASE_URL y que el servidor PostgreSQL esté activo.
- Cambios de modelo no reflejan: ejecuta npm run db:gen y npm run db:push.
  
🤝 Contribución
1. Crea una rama: feat/nueva-funcionalidad
2. Asegúrate de que npm run dev y npm run db:studio funcionen localmente.
3. Envía un Pull Request con descripción clara (qué, por qué y cómo probar).

