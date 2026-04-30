import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";
import { seedWorkflows } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/workflows";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsWorkflowTipoDocumento[] = seedWorkflows();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsWorkflowTipoDocumentoDTO = Omit<FluxodocsWorkflowTipoDocumento, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsWorkflowTipoDocumentoDTO = Partial<CreateFluxodocsWorkflowTipoDocumentoDTO>;

export async function fetchWorkflowTiposDocumento() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsWorkflowTipoDocumento[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchWorkflowTiposDocumentoById(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsWorkflowTipoDocumento>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createWorkflowTiposDocumento(data: CreateFluxodocsWorkflowTipoDocumentoDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsWorkflowTipoDocumento>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsWorkflowTipoDocumento = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsWorkflowTipoDocumento;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateWorkflowTiposDocumento(id: number, data: UpdateFluxodocsWorkflowTipoDocumentoDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsWorkflowTipoDocumento>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsWorkflowTipoDocumento = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsWorkflowTipoDocumento;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateWorkflowTiposDocumento(id: number) {
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
