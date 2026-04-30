import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";
import { seedRegrasFluxo } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/regras-fluxo";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsRegraFluxo[] = seedRegrasFluxo();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsRegraFluxoDTO = Omit<FluxodocsRegraFluxo, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsRegraFluxoDTO = Partial<CreateFluxodocsRegraFluxoDTO>;

export async function fetchRegrasFluxo() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsRegraFluxo[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchRegrasFluxo(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsRegraFluxo>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createRegrasFluxo(data: CreateFluxodocsRegraFluxoDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsRegraFluxo>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsRegraFluxo = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsRegraFluxo;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateRegrasFluxo(id: number, data: UpdateFluxodocsRegraFluxoDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsRegraFluxo>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsRegraFluxo = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsRegraFluxo;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateRegrasFluxo(id: number) {
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
