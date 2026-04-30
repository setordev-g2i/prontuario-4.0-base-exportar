import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";
import { seedParametrosSla } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/parametros-sla";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsParametroSla[] = seedParametrosSla();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsParametroSlaDTO = Omit<FluxodocsParametroSla, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsParametroSlaDTO = Partial<CreateFluxodocsParametroSlaDTO>;

export async function fetchParametrosSla() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsParametroSla[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchParametrosSlaById(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsParametroSla>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createParametrosSla(data: CreateFluxodocsParametroSlaDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsParametroSla>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsParametroSla = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsParametroSla;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateParametrosSla(id: number, data: UpdateFluxodocsParametroSlaDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsParametroSla>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsParametroSla = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsParametroSla;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateParametrosSla(id: number) {
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
