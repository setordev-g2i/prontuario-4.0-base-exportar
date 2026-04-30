import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsStatusItem } from "@/types/entities/Fluxodocs";
import { seedStatusItem } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/status-item";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsStatusItem[] = seedStatusItem();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsStatusItemDTO = Omit<FluxodocsStatusItem, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsStatusItemDTO = Partial<CreateFluxodocsStatusItemDTO>;

export async function fetchStatusItem() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsStatusItem[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchStatusItemById(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsStatusItem>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createStatusItem(data: CreateFluxodocsStatusItemDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsStatusItem>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsStatusItem = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsStatusItem;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateStatusItem(id: number, data: UpdateFluxodocsStatusItemDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsStatusItem>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsStatusItem = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsStatusItem;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateStatusItem(id: number) {
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
