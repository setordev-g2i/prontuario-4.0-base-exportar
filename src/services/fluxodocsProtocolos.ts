import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";
import { seedProtocolos } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/protocolos";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsProtocolo[] = seedProtocolos();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsProtocoloDTO = Omit<FluxodocsProtocolo, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsProtocoloDTO = Partial<CreateFluxodocsProtocoloDTO>;

export async function fetchProtocolos() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsProtocolo[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchProtocolo(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsProtocolo>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createProtocolo(data: CreateFluxodocsProtocoloDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsProtocolo>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsProtocolo = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsProtocolo;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateProtocolo(id: number, data: UpdateFluxodocsProtocoloDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsProtocolo>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsProtocolo = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsProtocolo;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateProtocolo(id: number) {
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
