import { hashSync } from 'bcryptjs';

import initialPizzas from '../../../data/initial-pizzas.json';
import { BCRYPT_ROUNDS } from '@/lib/auth/password';
import type { Pizza, Session, User, UserRole } from '@/types';

interface SeedPizza {
  name: string;
  ingredients: string[];
  prepTime: number;
  cookTime: number;
  price: number;
  ownerUsername: string;
}

interface SeedUser {
  username: string;
  password: string;
  role: UserRole;
}

const SEED_USERS: SeedUser[] = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'user', password: 'user123', role: 'user' },
];

export interface MemoryStore {
  users: Map<string, User>;
  usernames: Map<string, string>;
  pizzas: Map<string, Pizza>;
  sessions: Map<string, Session>;
}

function seed(store: MemoryStore): void {
  const now = new Date().toISOString();
  const usersByUsername = new Map<string, User>();

  for (const seedUser of SEED_USERS) {
    const user: User = {
      id: crypto.randomUUID(),
      username: seedUser.username,
      passwordHash: hashSync(seedUser.password, BCRYPT_ROUNDS),
      role: seedUser.role,
      createdAt: now,
    };
    store.users.set(user.id, user);
    store.usernames.set(user.username.toLowerCase(), user.id);
    usersByUsername.set(user.username, user);
  }

  for (const seedPizza of initialPizzas as SeedPizza[]) {
    const owner = usersByUsername.get(seedPizza.ownerUsername);
    if (!owner) continue;

    const pizza: Pizza = {
      id: crypto.randomUUID(),
      name: seedPizza.name,
      ingredients: seedPizza.ingredients,
      prepTime: seedPizza.prepTime,
      cookTime: seedPizza.cookTime,
      price: seedPizza.price,
      ownerId: owner.id,
      createdAt: now,
      updatedAt: now,
    };
    store.pizzas.set(pizza.id, pizza);
  }
}

function createStore(): MemoryStore {
  const store: MemoryStore = {
    users: new Map(),
    usernames: new Map(),
    pizzas: new Map(),
    sessions: new Map(),
  };
  seed(store);
  return store;
}

const globalForStore = globalThis as unknown as { __pizzaMemoryStore?: MemoryStore };

export const memoryStore: MemoryStore = globalForStore.__pizzaMemoryStore ?? createStore();

if (process.env.NODE_ENV !== 'production') {
  globalForStore.__pizzaMemoryStore = memoryStore;
}
