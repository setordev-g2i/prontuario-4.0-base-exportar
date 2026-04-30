import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";
import { seedTiposDocumento } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/tipos-documento";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsTipoDocumento[] = seedTiposDocumento();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsTipoDocumentoDTO = Omit<FluxodocsTipoDocumento, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsTipoDocumentoDTO = Partial<CreateFluxodocsTipoDocumentoDTO>;

export async function fetchTiposDocumento() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoDocumento[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchTiposDocumento(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoDocumento>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createTiposDocumento(data: CreateFluxodocsTipoDocumentoDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsTipoDocumento>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsTipoDocumento = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoDocumento;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateTiposDocumento(id: number, data: UpdateFluxodocsTipoDocumentoDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsTipoDocumento>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsTipoDocumento = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoDocumento;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateTiposDocumento(id: number) {
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
