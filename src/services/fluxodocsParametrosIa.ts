import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";
import { seedParametrosIa } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/parametros-ia";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsParametroIa[] = seedParametrosIa();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsParametroIaDTO = Omit<FluxodocsParametroIa, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsParametroIaDTO = Partial<CreateFluxodocsParametroIaDTO>;

export async function fetchParametrosIa() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsParametroIa[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchParametrosIa(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsParametroIa>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createParametrosIa(data: CreateFluxodocsParametroIaDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsParametroIa>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsParametroIa = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsParametroIa;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateParametrosIa(id: number, data: UpdateFluxodocsParametroIaDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsParametroIa>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsParametroIa = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsParametroIa;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateParametrosIa(id: number) {
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
