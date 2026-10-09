# DECISIONS — Architecture Decision Records

Registro breve de las decisiones técnicas relevantes y su justificación.

---

## ADR-001 — Clean Architecture ligera por módulos

**Contexto**: Necesitamos una estructura clara, escalable y sencilla de mantener, sin caer
en sobreingeniería, orientada además a enseñar buenas prácticas.

**Decisión**: Organizar por módulos de dominio (`modules/auth`, `modules/pizzas`), cada uno
con `domain`, `application` e `infrastructure`. Los route handlers de `app/api` son finos y
delegan en controllers que, a su vez, llaman a casos de uso.

**Consecuencias**:
- (+) Separación clara de responsabilidades y regla de dependencia explícita.
- (+) Fácil añadir nuevos módulos sin tocar los existentes.
- (−) Más archivos que un enfoque plano, a cambio de claridad.

---

## ADR-002 — Almacenamiento 100% en memoria

**Contexto**: Es una API mock para un curso; no se requiere persistencia real.

**Decisión**: Usar un singleton `MemoryStore` con `Maps` tipados (`users`, `pizzas`,
`sessions`). Los usuarios se crean en memoria al registrarse; no hay `users.json`.

**Consecuencias**:
- (+) Cero infraestructura, arranque instantáneo, ideal para demo.
- (−) Los datos se pierden en reinicios y entre instancias serverless de Vercel.

---

## ADR-003 — Hash real con bcryptjs (no mock)

**Contexto**: La auth es mock, pero se quiere reflejar un flujo realista.

**Decisión**: Hashear contraseñas con `bcryptjs` (cost 10) y verificar con `compare`.

**Consecuencias**:
- (+) Práctica realista de seguridad; los hashes nunca se exponen.
- (−) ~50 ms por login (irrelevante para el curso).

---

## ADR-004 — JWT con jose y expiración de 12h

**Contexto**: Se necesita un Bearer token de sesión entregado en el login.

**Decisión**: Firmar JWT (HS256) con `jose`, con expiración de 12 horas, y registrar la
sesión en memoria para poder validarla/revocarla.

**Consecuencias**:
- (+) Estándar, fácil de testear con Bruno (`Authorization: Bearer <token>`).
- (−) La revocación en memoria no sobrevive a un cold start (asumible).

---

## ADR-005 — Validación centralizada con Zod

**Contexto**: Necesitamos validar bodies, params y queries de forma consistente.

**Decisión**: Definir todos los esquemas con Zod en `lib/validators`, reutilizados tanto por
los controllers como por la generación de la spec OpenAPI.

**Consecuencias**:
- (+) Una única fuente de verdad para validación y documentación.
- (+) Inferencia de tipos TypeScript automática.
- (−) Dependencia adicional (ampliamente adoptada en el ecosistema Next.js).

---

## ADR-006 — Scalar en lugar de Swagger UI

**Contexto**: Se quiere una UI de documentación con "Try it out" real.

**Decisión**: Usar `@scalar/nextjs-api-reference` frente a `swagger-ui-react`.

**Consecuencias**:
- (+) Interfaz moderna, más ligera y con mejor DX de integración en Next.js.
- (+) Consume la spec OpenAPI generada desde Zod, siempre sincronizada con el código.
- (−) Menos "clásica" que Swagger UI para alumnos que ya la conozcan.

---

## ADR-007 — Sin tests automatizados

**Contexto**: El objetivo del curso es aprender a testear la API con Bruno.

**Decisión**: No incluir framework de tests (no Vitest/Jest). La verificación es de tipos y
lint, más las colecciones de Bruno.

**Consecuencias**:
- (+) Menos ruido en el repo; el foco está en el cliente de testing.
- (−) Sin red de seguridad automatizada (aceptable para un mock).

---

## ADR-008 — El registro permite elegir el rol

**Contexto**: En un escenario real, dejar que cualquiera se registre como `admin` sería un
agujero de seguridad. Pero el objetivo es un curso corto: hace falta poder crear admins y
usuarios rápido, sin montar gestión de privilegios.

**Decisión**: `POST /api/auth/register` acepta un campo `role` opcional (`user` por defecto,
`admin` como alternativa). No hay ninguna comprobación adicional.

**Consecuencias**:
- (+) Arranque del curso inmediato: se crean usuarios y admins en un paso.
- (−) Inseguro por diseño; queda documentado como simplificación consciente del mock.

---

## ADR-009 — `GET /api/users` reservado a admins

**Contexto**: Para preparar datos de prueba (y ver los IDs de los usuarios) resulta útil
listar los usuarios, pero no debería ser información pública.

**Decisión**: `GET /api/users` requiere autenticación y rol `admin`. La autorización por rol
se comprueba en el controller (el middleware solo autentica).

**Consecuencias**:
- (+) Se pueden obtener IDs y roles para el curso sin exponer la lista públicamente.
- (−) La autorización vive en la capa de aplicación, no en el middleware (correcto, ya que el
  middleware no conoce reglas de negocio).
