# TODO — Pizza Mock API

> Checklist de implementación. Se deriva de `docs/SPEC.md`.
> Marca `[x]` a medida que se completan las tareas.

## PASO 0 — Documentación

- [x] `docs/SPEC.md`
- [x] `docs/TODO.md`
- [x] `docs/DECISIONS.md`

## FASE 1 — Setup

- [x] `package.json` (deps + scripts: dev, build, start, lint, typecheck)
- [x] `tsconfig.json` (strict, paths `@/*`, `@/modules/*`, `@/lib/*`)
- [x] `next.config.mjs`
- [x] `.env.example` (`JWT_SECRET`)
- [x] `eslint.config.mjs`
- [x] `.prettierrc` + `.prettierignore`
- [x] `.gitignore`

## FASE 2 — Tipos y validadores (Zod)

- [x] `src/types/index.ts` (`UserRole`, `User`, `Pizza`, `Session`, `ApiError`)
- [x] `src/lib/validators/pizza.ts` (create, update, patch, search, response, params)
- [x] `src/lib/validators/auth.ts` (login, register)
- [x] `src/lib/validators/common.ts` (error response)

## FASE 3 — Memory store + seed

- [x] `src/lib/storage/memory-store.ts` (Maps + CRUD + seed)
- [x] `data/initial-pizzas.json` (pizzas de partida)
- [x] Usuarios semilla en memoria (`admin`, `user`)

## FASE 4 — Auth module

- [x] `domain/entities/user.ts`
- [x] `domain/repositories/user-repository.ts`
- [x] `application/dto/auth.dto.ts`
- [x] `application/use-cases/login.ts`
- [x] `application/use-cases/register.ts`
- [x] `application/mappers/user.mapper.ts`
- [x] `infrastructure/repositories/memory-user-repository.ts`
- [x] `infrastructure/controllers/auth.controller.ts`
- [x] `src/lib/auth/tokens.ts` (jose, HS256, 12h)
- [x] `src/lib/auth/session-store.ts`
- [x] `src/lib/auth/password.ts` (bcryptjs)
- [x] `src/lib/auth/request-user.ts`

## FASE 5 — Pizzas module

- [x] `domain/entities/pizza.ts` (create, withChanges, canModify)
- [x] `domain/repositories/pizza-repository.ts`
- [x] `application/dto/pizza.dto.ts`
- [x] `application/use-cases/list-pizzas.ts`
- [x] `application/use-cases/get-pizza-by-id.ts`
- [x] `application/use-cases/search-pizza-by-name.ts`
- [x] `application/use-cases/create-pizza.ts`
- [x] `application/use-cases/update-pizza.ts`
- [x] `application/use-cases/partial-update-pizza.ts`
- [x] `application/use-cases/delete-pizza.ts`
- [x] `application/policies/pizza-policy.ts`
- [x] `application/mappers/pizza.mapper.ts`
- [x] `infrastructure/repositories/memory-pizza-repository.ts`
- [x] `infrastructure/controllers/pizza.controller.ts`

## FASE 6 — Middleware + rutas API

- [x] `src/middleware.ts`
- [x] `src/app/api/auth/login/route.ts`
- [x] `src/app/api/auth/register/route.ts`
- [x] `src/app/api/pizzas/route.ts` (GET)
- [x] `src/app/api/pizzas/new/route.ts` (POST)
- [x] `src/app/api/pizzas/search/route.ts` (GET)
- [x] `src/app/api/pizzas/[pizzaId]/route.ts` (GET, PUT, PATCH, DELETE)

## FASE 7 — OpenAPI + Scalar UI

- [x] `src/lib/openapi/spec.ts`
- [x] `src/lib/zod.ts` (extensión OpenAPI + instancia única de zod)
- [x] `src/app/api/docs/route.ts`
- [x] `src/app/docs/route.ts` (Scalar)

## FASE 8 — Errores + utilidades

- [x] `src/lib/errors/api-error.ts`
- [x] `src/lib/utils/response.ts`

## FASE 9 — Frontend mínimo

- [x] `src/app/(frontend)/layout.tsx`
- [x] `src/app/(frontend)/page.tsx`
- [x] `src/app/layout.tsx`
- [x] `src/app/globals.css`

## FASE 10 — Verificación

- [x] `npm install`
- [x] `npm run lint` (0 errores)
- [x] `npm run typecheck` (0 errores)
- [x] `npm run build`
- [x] Test manual de endpoints (login, CRUD, ownership vs admin, search, register, docs)
- [ ] Colecciones de Bruno (a cargo del alumno)

## MEJORAS POSTERIORES

- [x] `register` acepta campo `role` opcional (`user` por defecto, `admin`)
- [x] `GET /api/users` (listado de usuarios, solo admins)
- [x] `UserRepository.findAll` + `ListUsersUseCase`
- [x] Middleware: protege `/api/users` y mantiene públicas las lecturas de pizzas
- [x] OpenAPI: `role` en registro y documentación de `/api/users`
- [x] `GET /api/pizzas/:pizzaId` (obtener una pizza por id)
- [x] Campo calculado `totalTime` (`prepTime + cookTime + 1`) en todas las respuestas de pizza
- [x] OpenAPI: documentado `GET /api/pizzas/{pizzaId}` y `totalTime` en el esquema `Pizza`

