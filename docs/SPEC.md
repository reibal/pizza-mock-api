# SPEC — Pizza Mock API

> Especificación funcional y técnica de la API mock de gestión de pizzas.
> Este documento es la fuente de verdad del proyecto: qué construimos, por qué y cómo.

## 1. Objetivo

API mock con frontend mínimo de documentación para un curso de testing con **Bruno**.
Simula la gestión de un catálogo de pizzas con autenticación y roles.

- **Sin base de datos**: todo en memoria (Maps).
- **Sin persistencia**: el estado se reinicia en cada arranque (o cold start en Vercel).
- **Foco**: claridad arquitectónica y limpieza de código, no rendimiento.

## 2. Stack

| Tecnología | Uso |
|------------|-----|
| Next.js (App Router) | Framework full-stack |
| TypeScript (strict) | Lenguaje |
| Zod | Validación de datos en los boundaries |
| jose | Firma/verificación de JWT (Bearer tokens) |
| bcryptjs | Hash de contraseñas |
| @scalar/nextjs-api-reference | UI interactiva de documentación |
| zod-to-openapi | Generación de la spec OpenAPI desde Zod |

## 3. Arquitectura

Clean Architecture ligera por módulos de dominio.

```
app/api/*          → Adaptadores HTTP finos (route handlers)
modules/*/domain   → Entidades y contratos (repositorios, interfaces)
modules/*/application → Casos de uso, DTOs, mappers
modules/*/infrastructure → Implementaciones (repositorios en memoria, controllers)
lib/*              → Infraestructura transversal (storage, auth, validators, errors, openapi)
data/*             → Datos semilla (pizzas iniciales)
```

**Regla de dependencia**: `infrastructure → application → domain`. El dominio no conoce
ni Next.js, ni Zod, ni el almacenamiento.

### Flujo de una petición

```
Request
  → middleware.ts            (extrae y valida Bearer token en rutas protegidas)
  → app/api/**/route.ts      (delegación delgada)
  → controller               (valida body/params con Zod, traduce HTTP ↔ DTO)
  → use-case                 (reglas de negocio)
  → repository (interface)   (implementado en infrastructure → MemoryStore)
  → entidad de dominio
  → mapper → DTO de respuesta
  → NextResponse (JSON)
```

## 4. Modelos de dominio

### User

| Campo | Tipo | Notas |
|-------|------|-------|
| id | string | UUID |
| username | string | único (case-insensitive) |
| passwordHash | string | bcrypt |
| role | `"user" \| "admin"` | |

### Pizza

| Campo | Tipo | Notas |
|-------|------|-------|
| id | string | UUID |
| name | string | único (case-insensitive) |
| ingredients | string[] | |
| prepTime | number | minutos |
| cookTime | number | minutos |
| price | number | |
| ownerId | string | id del usuario creador |
| createdAt / updatedAt | string (ISO) | |

### Session

| Campo | Tipo | Notas |
|-------|------|-------|
| token | string | JWT firmado (HS256) |
| userId | string | |
| role | `"user" \| "admin"` | |
| expiresAt | number | epoch ms (12h de validez) |

## 5. Reglas de negocio

- **RN-01**: No pueden existir dos pizzas con el mismo nombre (comparación case-insensitive).
- **RN-02**: Un usuario `user` solo puede modificar/eliminar pizzas de las que es `owner`.
- **RN-03**: Un usuario `admin` puede modificar/eliminar cualquier pizza.
- **RN-04**: Crear una pizza requiere autenticación; el `ownerId` se toma del token.
- **RN-05**: `register` no devuelve token de sesión; hay que hacer `login` después.
- **RN-06**: `register` falla si el username ya existe (case-insensitive).
- **RN-07**: Los tokens expiran a las 12 horas.
- **RN-08**: Guardar/actualizar (`save`) una pizza puede crear (POST) o actualizar (PUT/PATCH).
- **RN-09**: `register` acepta un `role` opcional (`user` por defecto, o `admin`). Es una
  simplificación deliberada para el curso: no hay verificación de privilegios para crear admins.
- **RN-10**: Solo un `admin` autenticado puede listar usuarios (`GET /api/users`).

## 6. Endpoints

| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| GET | `/api/pizzas` | No | Lista todas las pizzas |
| GET | `/api/pizzas/search?name=<name>` | No | Busca por nombre (case-insensitive). 404 si no existe |
| POST | `/api/auth/login` | No | Devuelve `{ token, user }` si las credenciales son válidas |
| POST | `/api/auth/register` | No | Crea usuario (cuerpo con `role` opcional, por defecto `user`). No devuelve token |
| GET | `/api/users` | Sí (admin) | Lista todos los usuarios con su id, username, rol y fecha de alta |
| POST | `/api/pizzas/new` | Sí | Crea pizza. 409 si el nombre ya existe |
| PUT | `/api/pizzas/:pizzaId` | Sí | Reemplaza la pizza (body completo). Dueño o admin |
| PATCH | `/api/pizzas/:pizzaId` | Sí | Modifica campos parciales. Dueño o admin |
| DELETE | `/api/pizzas/:pizzaId` | Sí | Elimina la pizza. Dueño o admin |
| GET | `/api/docs` | No | Sirve la spec OpenAPI (JSON) |

### Códigos de estado

| Código | Uso |
|--------|-----|
| 200 | OK (GET, PUT, PATCH, DELETE) |
| 201 | Creado (POST nueva pizza / registro) |
| 400 | Body/query inválido (validación Zod) |
| 401 | Falta token o es inválido/expirado; credenciales incorrectas en login |
| 403 | Autenticado pero sin permisos (no es dueño ni admin) |
| 404 | Recurso no encontrado |
| 409 | Conflicto (nombre de pizza o username ya existe) |

### Formato de error

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Pizza not found",
    "details": []
  }
}
```

## 7. Autenticación (flujo)

1. `POST /api/auth/login` con `{ username, password }`.
2. Se busca el usuario (case-insensitive), se compara password con `bcrypt.compare`.
3. Si es válido: `jose` firma un JWT `{ sub, role }` con expiración 12h; se registra la sesión en memoria.
4. El cliente usa `Authorization: Bearer <token>` en las rutas protegidas.
5. `middleware.ts` verifica el token y adjunta `{ userId, role }` a la request para el controller.

## 8. Estado en memoria

`MemoryStore` es un **singleton** con `Map`s tipados:

- `users: Map<string, User>` (key = id)
- `pizzas: Map<string, Pizza>` (key = id)
- `sessions: Map<string, Session>` (key = token)

Al arrancar el módulo se cargan las pizzas de `data/initial-pizzas.json` y se crean los
usuarios semilla (`admin` / `user`) en memoria.

> **Limitación conocida**: en Vercel (serverless) cada instancia tiene su propia memoria y
> los datos se pierden en cold start. Es aceptable para una API mock de curso.

## 9. Frontend

- `/` → landing con la descripción de la API y enlaces.
- `/docs` → Scalar API Reference embebida (interactiva, "Try it out").

## 10. Visibilidad de datos de ejemplo

`data/initial-pizzas.json` define las pizzas de partida. Sus `ownerId` apuntan a los
usuarios semilla creados en memoria (ver `MemoryStore`).
