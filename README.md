# 🍕 Pizza Mock API

API de práctica (mock) que simula la gestión de un catálogo de pizzas, con autenticación y roles.
Está pensada para el **curso de testing con Bruno**: te permite lanzar peticiones reales, probar
casos válidos y de error, y practicar con un flujo de autenticación tipo token.

> ⚠️ Es una API **mock**: los datos viven en memoria y se reinician cada vez que el servidor
> arranca. No hay base de datos ni persistencia.

---

## ¿Qué incluye?

- Autenticación por usuario y contraseña con **Bearer token** (JWT válido 12 h).
- Dos roles: `user` y `admin`.
- CRUD de pizzas con reglas de permisos.
- Validación de datos con Zod.
- Documentación interactiva de la API (Scalar) generada desde el propio código.

---

## Tecnologías

- [Next.js 15](https://nextjs.org/) (App Router) + TypeScript
- [Zod](https://zod.dev/) para validación
- [jose](https://github.com/panva/jose) para firmar/verificar tokens
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js) para hashear contraseñas
- [Scalar](https://scalar.com/) para la documentación interactiva

---

## Requisitos

- Node.js 20 o superior
- npm

---

## Cómo arrancarlo

```bash
# 1. Instala las dependencias
npm install

# 2. (Opcional en local) crea tu archivo de variables de entorno
cp .env.example .env.local

# 3. Arranca en modo desarrollo
npm run dev
```

Abre:

- `http://localhost:3000` → página de inicio con el resumen de la API.
- `http://localhost:3000/docs` → documentación interactiva (puedes probar los endpoints ahí mismo).

### Variables de entorno

| Variable | Para qué sirve | ¿Obligatoria? |
|----------|----------------|----------------|
| `JWT_SECRET` | Secreto para firmar los tokens | En producción sí; en local hay un valor por defecto |

En producción (por ejemplo Vercel), define `JWT_SECRET` con un valor largo y aleatorio, por ejemplo:

```bash
openssl rand -base64 32
```

### Otros comandos

```bash
npm run build      # Compila para producción
npm run start      # Sirve la versión compilada
npm run lint       # Revisa el estilo y errores
npm run typecheck  # Comprueba los tipos de TypeScript
npm run format     # Da formato al código con Prettier
```

---

## Usuarios de ejemplo

Al arrancar, la API crea dos usuarios en memoria:

| Usuario | Contraseña | Rol | Permisos |
|---------|-----------|-----|----------|
| `admin` | `admin123` | `admin` | Crear, editar y borrar **cualquier** pizza |
| `user`  | `user123`  | `user`  | Crear pizzas y editar/borrar **solo las suyas** |

También puedes crear tu propio usuario con `POST /api/auth/register`.

---

## Cómo autenticarse

1. Haz login para obtener el token:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user","password":"user123"}'
```

Respuesta:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": { "id": "...", "username": "user", "role": "user", "createdAt": "..." }
}
```

2. Envía ese token en la cabecera de las peticiones protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

---

## Crear usuarios (y admins)

Con `POST /api/auth/register` puedes crear tanto usuarios normales como administradores.
El campo `role` es **opcional** y por defecto es `user`:

```bash
# Usuario normal (role por defecto)
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"pepe","password":"pepe123","confirmPassword":"pepe123"}'

# Administrador
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"root","password":"root123","confirmPassword":"root123","role":"admin"}'
```

> Nota: dejar elegir el rol es una simplificación pensada para el curso. En una API real
> esto sería un agujero de seguridad. Aquí lo usamos para no complicar el arranque.

Para ver los usuarios creados (y sus IDs), un admin puede llamar a `GET /api/users` con su token:

```bash
curl http://localhost:3000/api/users \
  -H "Authorization: Bearer <token-de-admin>"
```

---

## Endpoints

| Método | Ruta | ¿Auth? | Qué hace |
|--------|------|--------|----------|
| GET | `/api/pizzas` | No | Lista todas las pizzas |
| GET | `/api/pizzas/search?name=carbonara` | No | Busca una pizza por nombre (no distingue mayúsculas) |
| GET | `/api/pizzas/{pizzaId}` | No | Devuelve una pizza por su id |
| POST | `/api/auth/login` | No | Devuelve un token si las credenciales son correctas |
| POST | `/api/auth/register` | No | Crea un usuario (el rol es opcional) |
| GET | `/api/users` | Sí (admin) | Lista los usuarios con su id y rol |
| POST | `/api/pizzas/new` | Sí | Crea una pizza (nombre único) |
| PUT | `/api/pizzas/{pizzaId}` | Sí | Reemplaza una pizza (cuerpo completo) |
| PATCH | `/api/pizzas/{pizzaId}` | Sí | Modifica solo los campos enviados |
| DELETE | `/api/pizzas/{pizzaId}` | Sí | Borra una pizza |
| GET | `/api/docs` | No | Devuelve la especificación OpenAPI en JSON |

### Cuerpo de una pizza

```json
{
  "name": "Hawaiana",
  "ingredients": ["piña", "jamón", "mozzarella"],
  "prepTime": 10,
  "cookTime": 12,
  "price": 9.5
}
```

La respuesta incluye además `id`, `ownerId`, `createdAt`, `updatedAt` y el campo calculado
`totalTime` (la suma de `prepTime` + `cookTime` más 1 minuto).

---

## Reglas de negocio (resumen)

- No puede haber dos pizzas con el mismo nombre (se ignora mayúsculas/minúsculas).
- Toda respuesta con una pizza incluye un campo calculado `totalTime` (`prepTime` + `cookTime` + 1), que no se envía al crear o editar.
- Un `user` solo puede editar o borrar las pizzas que ha creado.
- Un `admin` puede editar o borrar cualquier pizza.
- El token caduca a las 12 horas.
- `register` no inicia sesión: después hay que hacer `login`.

## Códigos de estado más comunes

| Código | Significado |
|--------|-------------|
| 200 | OK |
| 201 | Creado |
| 400 | Datos inválidos o JSON mal formado |
| 401 | Falta el token, es inválido, o las credenciales son incorrectas |
| 403 | Autenticado, pero sin permisos |
| 404 | No encontrado |
| 409 | Conflicto (nombre de pizza o de usuario ya existente) |

Los errores tienen siempre este formato:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Pizza not found"
  }
}
```

---

## Estructura del proyecto

```
src/
├── app/                    # Rutas de Next.js
│   ├── api/                # Endpoints de la API (route handlers finos)
│   ├── docs/               # Documentación interactiva (Scalar)
│   └── (frontend)/         # Página de inicio
├── modules/                # Lógica de negocio por dominio
│   ├── auth/               # Entidades, casos de uso, repositorios y controllers
│   └── pizzas/
├── lib/                    # Infraestructura compartida
│   ├── storage/            # Almacén en memoria + datos semilla
│   ├── auth/               # Tokens, contraseñas y sesiones
│   ├── validators/         # Esquemas de validación (Zod)
│   ├── errors/             # Errores tipados de la API
│   └── openapi/            # Generación de la especificación OpenAPI
data/
└── initial-pizzas.json     # Pizzas de ejemplo con las que arranca la API
docs/
├── SPEC.md                 # Especificación funcional y técnica
├── DECISIONS.md            # Decisiones de arquitectura
└── TODO.md                 # Checklist de implementación
```

Cada módulo de `src/modules` sigue una arquitectura limpia en tres capas:

- **domain**: entidades y contratos (repositorios).
- **application**: casos de uso, DTOs y mappers.
- **infrastructure**: implementaciones concretas (repositorios en memoria y controllers HTTP).

---

## Despliegue en Vercel

1. Sube el repositorio a GitHub.
2. Importa el proyecto en [Vercel](https://vercel.com/).
3. Define la variable de entorno `JWT_SECRET`.
4. Despliega. Vercel detecta Next.js automáticamente.

> Recuerda: en Vercel (serverless) los datos en memoria se pierden entre arranques y no se
> comparten entre instancias. Es una limitación esperada en una API mock.

---

## Recursos para el curso

- Documentación interactiva: `/docs`
- Especificación OpenAPI (JSON): `/api/docs`
- Detalles técnicos y decisiones: carpeta `docs/`
