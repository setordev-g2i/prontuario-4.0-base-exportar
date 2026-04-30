/**
 * Fábrica genérica de service mock em memória para o módulo Fluxo de Documentos.
 * Cada entidade tem seu próprio service que apenas chama makeMockService.
 *
 * Quando o backend existir, troca-se o corpo das funções por chamadas axios
 * (mantendo a mesma assinatura).
 */
import type { FluxodocsBase } from "@/types/entities/Fluxodocs";

const MOCK_USER_ID = 1;

export function nowISO(): string {
  return new Date().toISOString();
}

export interface MockService<T extends FluxodocsBase> {
  fetchAll: () => Promise<T[]>;
  fetchById: (id: number) => Promise<T | null>;
  create: (data: Partial<T>) => Promise<T>;
  update: (id: number, data: Partial<T>) => Promise<T>;
  inactivate: (id: number) => Promise<void>;
  reactivate: (id: number) => Promise<void>;
  fetchOptions: (labelKey: keyof T) => Promise<{ id: number; value: string }[]>;
}

export function makeMockService<T extends FluxodocsBase>(
  seedFn: () => T[],
): MockService<T> {
  let store: T[] = seedFn();
  let nextId = (store.reduce((max, r) => Math.max(max, r.id), 0) || 0) + 1;

  return {
    async fetchAll() {
      return [...store];
    },
    async fetchById(id) {
      return store.find((r) => r.id === id) ?? null;
    },
    async create(data) {
      const created = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as T;
      store = [created, ...store];
      return created;
    },
    async update(id, data) {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated = {
        ...store[idx],
        ...(data as object),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as T;
      store[idx] = updated;
      return updated;
    },
    async inactivate(id) {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      store[idx] = { ...store[idx], situacaoId: 2, modified: nowISO() };
    },
    async reactivate(id) {
      const idx = store.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      store[idx] = { ...store[idx], situacaoId: 1, modified: nowISO() };
    },
    async fetchOptions(labelKey) {
      return store
        .filter((r) => r.situacaoId === 1)
        .map((r) => ({ id: r.id, value: String(r[labelKey] ?? r.id) }));
    },
  };
}

/** Helper: gera N seeds variando um nome base. */
export function seedRange<T>(
  count: number,
  builder: (i: number) => Omit<T, "id">,
  startId = 1,
): T[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    ...builder(i),
  })) as T[];
}

export function baseAudit() {
  return {
    situacaoId: 1,
    userCreatedId: MOCK_USER_ID,
    created: nowISO(),
    userModifiedId: MOCK_USER_ID,
    modified: nowISO(),
  };
}
