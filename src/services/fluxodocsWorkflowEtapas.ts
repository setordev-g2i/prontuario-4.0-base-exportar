import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";
import { seedWorkflowEtapas } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/workflow-etapas";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsWorkflowEtapa[] = seedWorkflowEtapas();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsWorkflowEtapaDTO = Omit<FluxodocsWorkflowEtapa, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsWorkflowEtapaDTO = Partial<CreateFluxodocsWorkflowEtapaDTO>;

export async function fetchWorkflowEtapas() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsWorkflowEtapa[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchWorkflowEtapa(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsWorkflowEtapa>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createWorkflowEtapa(data: CreateFluxodocsWorkflowEtapaDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsWorkflowEtapa>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsWorkflowEtapa = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsWorkflowEtapa;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateWorkflowEtapa(id: number, data: UpdateFluxodocsWorkflowEtapaDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsWorkflowEtapa>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsWorkflowEtapa = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsWorkflowEtapa;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateWorkflowEtapa(id: number) {
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
