import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";
import { seedChecklist } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/checklist";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsChecklistDocumental[] = seedChecklist();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsChecklistDocumentalDTO = Omit<FluxodocsChecklistDocumental, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsChecklistDocumentalDTO = Partial<CreateFluxodocsChecklistDocumentalDTO>;

export async function fetchChecklistDocumental() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsChecklistDocumental[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchChecklistDocumental(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsChecklistDocumental>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createChecklistDocumental(data: CreateFluxodocsChecklistDocumentalDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsChecklistDocumental>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsChecklistDocumental = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsChecklistDocumental;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateChecklistDocumental(id: number, data: UpdateFluxodocsChecklistDocumentalDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsChecklistDocumental>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsChecklistDocumental = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsChecklistDocumental;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateChecklistDocumental(id: number) {
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
