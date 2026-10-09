import { memoryStore } from '@/lib/storage/memory-store';
import type { Session } from '@/types';

export const sessionStore = {
  create(session: Session): void {
    memoryStore.sessions.set(session.token, session);
  },

  get(token: string): Session | null {
    return memoryStore.sessions.get(token) ?? null;
  },

  remove(token: string): void {
    memoryStore.sessions.delete(token);
  },
};
