import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";
import { seedPrioridades } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/prioridades";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsPrioridade[] = seedPrioridades();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsPrioridadeDTO = Omit<FluxodocsPrioridade, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsPrioridadeDTO = Partial<CreateFluxodocsPrioridadeDTO>;

export async function fetchPrioridades() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsPrioridade[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchPrioridade(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsPrioridade>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createPrioridade(data: CreateFluxodocsPrioridadeDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsPrioridade>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsPrioridade = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsPrioridade;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updatePrioridade(id: number, data: UpdateFluxodocsPrioridadeDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsPrioridade>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsPrioridade = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsPrioridade;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivatePrioridade(id: number) {
  return tryApi(
    async () => {
      await api.patch(`${ENDPOINT}/${id}/inactivate`);
      return null;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      mockStore[idx] = { ...mockStore[idx], situacaoId: 2, modified: nowISO() };
      return null;
    },
  );
}
