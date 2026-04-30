/**
 * Factory de service genérico para entidades fluxodocs_*.
 * Mantém o padrão do projeto: tenta API real primeiro, faz fallback para mock em memória.
 *
 * Cada entidade chama createFluxodocsService<T>("/endpoint", seedFn) e recebe
 * um objeto com os métodos fetchAll, fetch, create, update, inactivate, reactivate.
 */
import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsAudit } from "@/types/entities/Fluxodocs";

const MOCK_USER_ID = 1;

function nowISO() {
  return new Date().toISOString();
}

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export interface FluxodocsService<T extends FluxodocsAudit> {
  fetchAll: () => Promise<T[]>;
  fetch: (id: number) => Promise<T | null>;
  create: (data: Omit<T, keyof FluxodocsAudit>) => Promise<T>;
  update: (id: number, data: Partial<Omit<T, keyof FluxodocsAudit>>) => Promise<T>;
  inactivate: (id: number) => Promise<void>;
  reactivate: (id: number) => Promise<void>;
}

export function createFluxodocsService<T extends FluxodocsAudit>(
  endpoint: string,
  seed: () => T[],
): FluxodocsService<T> {
  let store: T[] = seed();
  let nextId = (store.reduce((max, r) => Math.max(max, r.id), 0) || 0) + 1;

  return {
    async fetchAll() {
      return tryApi(
        async () => {
          const res = await api.get<ApiSuccessResponse<T[]>>(endpoint);
          return res.data.data;
        },
        () => [...store],
      );
    },
    async fetch(id) {
      return tryApi(
        async () => {
          const res = await api.get<ApiSuccessResponse<T>>(`${endpoint}/${id}`);
          return res.data.data;
        },
        () => store.find((r) => r.id === id) ?? null,
      );
    },
    async create(data) {
      return tryApi(
        async () => {
          const res = await api.post<ApiSuccessResponse<T>>(endpoint, data);
          return res.data.data;
        },
        () => {
          const novo = {
            ...(data as object),
            id: nextId++,
            situacaoId: 1,
            userCreatedId: MOCK_USER_ID,
            created: nowISO(),
            userModifiedId: MOCK_USER_ID,
            modified: nowISO(),
          } as T;
          store = [novo, ...store];
          return novo;
        },
      );
    },
    async update(id, data) {
      return tryApi(
        async () => {
          const res = await api.put<ApiSuccessResponse<T>>(`${endpoint}/${id}`, data);
          return res.data.data;
        },
        () => {
          const idx = store.findIndex((r) => r.id === id);
          if (idx === -1) throw new Error("Registro não encontrado");
          const updated = {
            ...store[idx],
            ...data,
            userModifiedId: MOCK_USER_ID,
            modified: nowISO(),
          } as T;
          store[idx] = updated;
          return updated;
        },
      );
    },
    async inactivate(id) {
      await tryApi(
        async () => {
          await api.patch(`${endpoint}/${id}/inactivate`);
          return null;
        },
        () => {
          const idx = store.findIndex((r) => r.id === id);
          if (idx === -1) throw new Error("Registro não encontrado");
          store[idx] = { ...store[idx], situacaoId: 2, modified: nowISO() };
          return null;
        },
      );
    },
    async reactivate(id) {
      await tryApi(
        async () => {
          await api.patch(`${endpoint}/${id}/reactivate`);
          return null;
        },
        () => {
          const idx = store.findIndex((r) => r.id === id);
          if (idx === -1) throw new Error("Registro não encontrado");
          store[idx] = { ...store[idx], situacaoId: 1, modified: nowISO() };
          return null;
        },
      );
    },
  };
}
