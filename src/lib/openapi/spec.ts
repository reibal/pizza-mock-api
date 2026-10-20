import { OpenAPIRegistry, OpenApiGeneratorV31 } from '@asteasolutions/zod-to-openapi';

import { z } from '@/lib/zod';
import {
  loginResponseSchema,
  loginSchema,
  registerSchema,
  userResponseSchema,
} from '@/lib/validators/auth';
import { errorResponseSchema } from '@/lib/validators/common';
import { pizzaBodySchema, pizzaResponseSchema } from '@/lib/validators/pizza';

const registry = new OpenAPIRegistry();

registry.registerComponent('securitySchemes', 'bearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
});

const PizzaInput = registry.register('PizzaInput', pizzaBodySchema);
const PizzaPatch = registry.register('PizzaPatch', pizzaBodySchema.partial());
const Pizza = registry.register('Pizza', pizzaResponseSchema);
const User = registry.register('User', userResponseSchema);
const LoginInput = registry.register('LoginInput', loginSchema);
const RegisterInput = registry.register('RegisterInput', registerSchema);
const AuthResponse = registry.register('AuthResponse', loginResponseSchema);
const ErrorResponse = registry.register('ErrorResponse', errorResponseSchema);

const jsonBody = (description: string, schema: z.ZodType) => ({
  description,
  content: { 'application/json': { schema } },
});

const errorResponses = {
  400: jsonBody('Validation error', ErrorResponse),
  401: jsonBody('Missing or invalid credentials', ErrorResponse),
  403: jsonBody('Insufficient permissions', ErrorResponse),
  404: jsonBody('Resource not found', ErrorResponse),
  409: jsonBody('Resource already exists', ErrorResponse),
};

const bearerAuth: Array<Record<string, string[]>> = [{ bearerAuth: [] }];

registry.registerPath({
  method: 'get',
  path: '/api/pizzas',
  tags: ['Pizzas'],
  summary: 'List all pizzas',
  description: 'Returns every pizza stored in memory. Public endpoint.',
  responses: {
    200: {
      description: 'A list of pizzas',
      content: { 'application/json': { schema: z.array(Pizza) } },
    },
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/pizzas/search',
  tags: ['Pizzas'],
  summary: 'Search a pizza by name',
  description: 'Case-insensitive search by name. Public endpoint.',
  request: {
    query: z.object({ name: z.string().openapi({ example: 'carbonara' }) }),
  },
  responses: {
    200: jsonBody('The matching pizza', Pizza),
    400: jsonBody('Missing name query parameter', ErrorResponse),
    404: jsonBody('Pizza not found', ErrorResponse),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/pizzas/{pizzaId}',
  tags: ['Pizzas'],
  summary: 'Get a pizza by id',
  description: 'Returns a single pizza by its id. Public endpoint.',
  request: {
    params: z.object({ pizzaId: z.string().openapi({ example: 'uuid' }) }),
  },
  responses: {
    200: jsonBody('The requested pizza', Pizza),
    404: jsonBody('Pizza not found', ErrorResponse),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/pizzas/new',
  tags: ['Pizzas'],
  summary: 'Create a new pizza',
  description: 'Requires authentication. Pizza names are unique (case-insensitive).',
  security: bearerAuth,
  request: { body: jsonBody('Pizza to create', PizzaInput) },
  responses: {
    201: jsonBody('The created pizza', Pizza),
    400: jsonBody('Validation error', ErrorResponse),
    401: jsonBody('Missing or invalid token', ErrorResponse),
    409: jsonBody('A pizza with that name already exists', ErrorResponse),
  },
});

registry.registerPath({
  method: 'put',
  path: '/api/pizzas/{pizzaId}',
  tags: ['Pizzas'],
  summary: 'Replace a pizza',
  description: 'Replaces the whole pizza. Only the owner or an admin can do it.',
  security: bearerAuth,
  request: {
    params: z.object({ pizzaId: z.string().openapi({ example: 'uuid' }) }),
    body: jsonBody('The full pizza', PizzaInput),
  },
  responses: {
    200: jsonBody('The updated pizza', Pizza),
    400: jsonBody('Validation error', ErrorResponse),
    401: jsonBody('Missing or invalid token', ErrorResponse),
    403: jsonBody('Not the owner nor an admin', ErrorResponse),
    404: jsonBody('Pizza not found', ErrorResponse),
    409: jsonBody('A pizza with that name already exists', ErrorResponse),
  },
});

registry.registerPath({
  method: 'patch',
  path: '/api/pizzas/{pizzaId}',
  tags: ['Pizzas'],
  summary: 'Partially update a pizza',
  description: 'Updates only the provided fields. Only the owner or an admin can do it.',
  security: bearerAuth,
  request: {
    params: z.object({ pizzaId: z.string().openapi({ example: 'uuid' }) }),
    body: jsonBody('Fields to update', PizzaPatch),
  },
  responses: {
    200: jsonBody('The updated pizza', Pizza),
    400: jsonBody('Validation error', ErrorResponse),
    401: jsonBody('Missing or invalid token', ErrorResponse),
    403: jsonBody('Not the owner nor an admin', ErrorResponse),
    404: jsonBody('Pizza not found', ErrorResponse),
    409: jsonBody('A pizza with that name already exists', ErrorResponse),
  },
});

registry.registerPath({
  method: 'delete',
  path: '/api/pizzas/{pizzaId}',
  tags: ['Pizzas'],
  summary: 'Delete a pizza',
  description: 'Only the owner or an admin can do it.',
  security: bearerAuth,
  request: {
    params: z.object({ pizzaId: z.string().openapi({ example: 'uuid' }) }),
  },
  responses: {
    200: {
      description: 'Pizza deleted',
      content: {
        'application/json': {
          schema: z.object({
            message: z.string().openapi({ example: 'Pizza deleted successfully' }),
          }),
        },
      },
    },
    401: jsonBody('Missing or invalid token', ErrorResponse),
    403: jsonBody('Not the owner nor an admin', ErrorResponse),
    404: jsonBody('Pizza not found', ErrorResponse),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/login',
  tags: ['Auth'],
  summary: 'Log in',
  description: 'Returns a bearer token valid for 12 hours.',
  request: { body: jsonBody('Credentials', LoginInput) },
  responses: {
    200: jsonBody('Token and user', AuthResponse),
    400: errorResponses[400],
    401: jsonBody('Invalid username or password', ErrorResponse),
  },
});

registry.registerPath({
  method: 'post',
  path: '/api/auth/register',
  tags: ['Auth'],
  summary: 'Register a new user',
  description:
    'Creates a user. Does not return a token; log in afterwards. The role is optional and defaults to "user"; pass "admin" to create an administrator.',
  request: { body: jsonBody('New user data', RegisterInput) },
  responses: {
    201: jsonBody('The created user', User),
    400: errorResponses[400],
    409: jsonBody('Username already exists', ErrorResponse),
  },
});

registry.registerPath({
  method: 'get',
  path: '/api/users',
  tags: ['Users'],
  summary: 'List all users',
  description: 'Admin only. Returns every user with their id, username, role and creation date.',
  security: bearerAuth,
  responses: {
    200: {
      description: 'A list of users',
      content: { 'application/json': { schema: z.array(User) } },
    },
    401: jsonBody('Missing or invalid token', ErrorResponse),
    403: jsonBody('Only admins can list users', ErrorResponse),
  },
});

const generator = new OpenApiGeneratorV31(registry.definitions);

export function getOpenApiDocument() {
  return generator.generateDocument({
    openapi: '3.1.0',
    info: {
      title: 'Pizza Mock API',
      version: '1.0.0',
      description:
        'Mock API for a pizza catalog with authentication. Data lives in memory and resets on restart.',
    },
    tags: [
      { name: 'Pizzas', description: 'Pizza catalog operations' },
      { name: 'Auth', description: 'Authentication and registration' },
      { name: 'Users', description: 'User management (admin)' },
    ],
  });
}
