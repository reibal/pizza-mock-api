import { ApiReference } from '@scalar/nextjs-api-reference';

export const GET = ApiReference({
  sources: [{ url: '/api/docs', agent: { disabled: true } }],
  mcp: { disabled: true },
  hideClientButton: true,
  pageTitle: 'Pizza Mock API — Reference',
});
