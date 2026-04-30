import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";
import { seedSetores } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/setores";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsSetor[] = seedSetores();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsSetorDTO = Omit<FluxodocsSetor, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsSetorDTO = Partial<CreateFluxodocsSetorDTO>;

export async function fetchSetores() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsSetor[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchSetore(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsSetor>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createSetore(data: CreateFluxodocsSetorDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsSetor>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsSetor = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsSetor;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateSetore(id: number, data: UpdateFluxodocsSetorDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsSetor>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsSetor = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsSetor;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateSetore(id: number) {
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
