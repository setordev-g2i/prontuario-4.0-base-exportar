/**
 * Helper genérico de CRUD em mock para o módulo Fluxo de Documentos.
 *
 * Mantém um store em memória, simula tryApi (chama o endpoint informado;
 * em caso de falha, devolve o resultado do mock). Faz exclusão lógica via
 * situacaoId = 2 e timestamps de auditoria.
 */
import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { AuditMeta, SituacaoId } from "@/types/entities/fluxodocs";

const MOCK_USER_ID = 1;

export function nowISO() {
  return new Date().toISOString();
}

export async function tryApi<T>(
  fn: () => Promise<T>,
  fallback: () => T,
): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

/** Cria um CRUD genérico baseado em um store em memória. */
export interface CrudHandle<T extends AuditMeta & { id: number }> {
  list(): Promise<T[]>;
  get(id: number): Promise<T | null>;
  create(data: Omit<T, "id" | keyof AuditMeta> & Partial<AuditMeta>): Promise<T>;
  update(id: number, data: Partial<T>): Promise<T>;
  inactivate(id: number): Promise<T>;
  reactivate(id: number): Promise<T>;
}

export function createCrud<T extends AuditMeta & { id: number }>(
  endpoint: string,
  initial: T[],
): CrudHandle<T> {
  let store = [...initial];
  let nextId =
    store.reduce((acc, x) => (x.id > acc ? x.id : acc), 0) + 1;

  const baseAudit = (sit: SituacaoId = 1) => ({
    situacaoId: sit,
    userCreatedId: MOCK_USER_ID,
    created: nowISO(),
    userModifiedId: MOCK_USER_ID,
    modified: nowISO(),
  });

  return {
    async list() {
      return tryApi(
        async () => {
          const res = await api.get<ApiSuccessResponse<T[]>>(endpoint);
          return res.data.data;
        },
        () => [...store],
      );
    },

    async get(id: number) {
      return tryApi(
        async () => {
          const res = await api.get<ApiSuccessResponse<T>>(`${endpoint}/${id}`);
          return res.data.data;
        },
        () => store.find((x) => x.id === id) ?? null,
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
            ...baseAudit(),
            id: nextId++,
          } as T;
          store = [novo, ...store];
          return novo;
        },
      );
    },

    async update(id, data) {
      return tryApi(
        async () => {
          const res = await api.put<ApiSuccessResponse<T>>(
            `${endpoint}/${id}`,
            data,
          );
          return res.data.data;
        },
        () => {
          const idx = store.findIndex((x) => x.id === id);
          if (idx < 0) throw new Error("Registro não encontrado");
          const upd = {
            ...store[idx],
            ...data,
            id: store[idx].id,
            userModifiedId: MOCK_USER_ID,
            modified: nowISO(),
          } as T;
          store[idx] = upd;
          return upd;
        },
      );
    },

    async inactivate(id) {
      return tryApi(
        async () => {
          const res = await api.patch<ApiSuccessResponse<T>>(
            `${endpoint}/${id}`,
            { situacaoId: 2 },
          );
          return res.data.data;
        },
        () => {
          const idx = store.findIndex((x) => x.id === id);
          if (idx < 0) throw new Error("Registro não encontrado");
          store[idx] = {
            ...store[idx],
            situacaoId: 2,
            userModifiedId: MOCK_USER_ID,
            modified: nowISO(),
          };
          return store[idx];
        },
      );
    },

    async reactivate(id) {
      return tryApi(
        async () => {
          const res = await api.patch<ApiSuccessResponse<T>>(
            `${endpoint}/${id}`,
            { situacaoId: 1 },
          );
          return res.data.data;
        },
        () => {
          const idx = store.findIndex((x) => x.id === id);
          if (idx < 0) throw new Error("Registro não encontrado");
          store[idx] = {
            ...store[idx],
            situacaoId: 1,
            userModifiedId: MOCK_USER_ID,
            modified: nowISO(),
          };
          return store[idx];
        },
      );
    },
  };
}
