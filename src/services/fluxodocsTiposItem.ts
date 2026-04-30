import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsTipoItem } from "@/types/entities/Fluxodocs";
import { seedTiposItem } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/tipos-item";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsTipoItem[] = seedTiposItem();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsTipoItemDTO = Omit<FluxodocsTipoItem, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsTipoItemDTO = Partial<CreateFluxodocsTipoItemDTO>;

export async function fetchTiposItem() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoItem[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchTiposItem(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoItem>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createTiposItem(data: CreateFluxodocsTipoItemDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsTipoItem>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsTipoItem = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoItem;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateTiposItem(id: number, data: UpdateFluxodocsTipoItemDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsTipoItem>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsTipoItem = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoItem;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateTiposItem(id: number) {
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
