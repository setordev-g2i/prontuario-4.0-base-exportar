import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";
import { seedAprovacoes } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/aprovacoes";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsAprovacaoJustificativa[] = seedAprovacoes();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsAprovacaoJustificativaDTO = Omit<FluxodocsAprovacaoJustificativa, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsAprovacaoJustificativaDTO = Partial<CreateFluxodocsAprovacaoJustificativaDTO>;

export async function fetchAprovacoesJustificativa() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsAprovacaoJustificativa[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchAprovacoesJustificativa(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsAprovacaoJustificativa>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createAprovacoesJustificativa(data: CreateFluxodocsAprovacaoJustificativaDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsAprovacaoJustificativa>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsAprovacaoJustificativa = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsAprovacaoJustificativa;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateAprovacoesJustificativa(id: number, data: UpdateFluxodocsAprovacaoJustificativaDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsAprovacaoJustificativa>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsAprovacaoJustificativa = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsAprovacaoJustificativa;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateAprovacoesJustificativa(id: number) {
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
