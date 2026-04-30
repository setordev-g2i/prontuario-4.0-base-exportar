import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/Fluxodocs";
import { seedTiposMovimentacao } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/tipos-movimentacao";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsTipoMovimentacao[] = seedTiposMovimentacao();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsTipoMovimentacaoDTO = Omit<FluxodocsTipoMovimentacao, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsTipoMovimentacaoDTO = Partial<CreateFluxodocsTipoMovimentacaoDTO>;

export async function fetchTiposMovimentacao() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoMovimentacao[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchTiposMovimentacao(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsTipoMovimentacao>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createTiposMovimentacao(data: CreateFluxodocsTipoMovimentacaoDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsTipoMovimentacao>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsTipoMovimentacao = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoMovimentacao;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateTiposMovimentacao(id: number, data: UpdateFluxodocsTipoMovimentacaoDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsTipoMovimentacao>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsTipoMovimentacao = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsTipoMovimentacao;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateTiposMovimentacao(id: number) {
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
