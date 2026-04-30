import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";
import { seedStatus } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/status";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsStatus[] = seedStatus();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsStatusDTO = Omit<FluxodocsStatus, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsStatusDTO = Partial<CreateFluxodocsStatusDTO>;

export async function fetchStatus() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsStatus[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchStatu(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsStatus>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createStatu(data: CreateFluxodocsStatusDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsStatus>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsStatus = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsStatus;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateStatu(id: number, data: UpdateFluxodocsStatusDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsStatus>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsStatus = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsStatus;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateStatu(id: number) {
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
