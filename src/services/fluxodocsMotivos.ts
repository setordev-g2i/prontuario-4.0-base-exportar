import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";
import { seedMotivos } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/motivos";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsMotivo[] = seedMotivos();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsMotivoDTO = Omit<FluxodocsMotivo, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsMotivoDTO = Partial<CreateFluxodocsMotivoDTO>;

export async function fetchMotivos() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsMotivo[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchMotivo(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsMotivo>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createMotivo(data: CreateFluxodocsMotivoDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsMotivo>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsMotivo = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsMotivo;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateMotivo(id: number, data: UpdateFluxodocsMotivoDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsMotivo>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsMotivo = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsMotivo;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateMotivo(id: number) {
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
