import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";
import { seedProtocoloItens } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/protocolo-itens";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsProtocoloItem[] = seedProtocoloItens();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsProtocoloItemDTO = Omit<FluxodocsProtocoloItem, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsProtocoloItemDTO = Partial<CreateFluxodocsProtocoloItemDTO>;

export async function fetchProtocoloItens() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsProtocoloItem[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchProtocoloIten(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsProtocoloItem>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createProtocoloIten(data: CreateFluxodocsProtocoloItemDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsProtocoloItem>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsProtocoloItem = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsProtocoloItem;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateProtocoloIten(id: number, data: UpdateFluxodocsProtocoloItemDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsProtocoloItem>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsProtocoloItem = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsProtocoloItem;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateProtocoloIten(id: number) {
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
