import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";
import { seedDocumentosObrigatoriosConvenio } from "@/lib/fluxodocsMocks";

const ENDPOINT = "/fluxodocs/documentos-obrigatorios-convenio";
const MOCK_USER_ID = 1;

let mockStore: FluxodocsDocumentoObrigatorioConvenio[] = seedDocumentosObrigatoriosConvenio();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type CreateFluxodocsDocumentoObrigatorioConvenioDTO = Omit<FluxodocsDocumentoObrigatorioConvenio, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type UpdateFluxodocsDocumentoObrigatorioConvenioDTO = Partial<CreateFluxodocsDocumentoObrigatorioConvenioDTO>;

export async function fetchDocumentosObrigatoriosConvenio() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsDocumentoObrigatorioConvenio[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetchDocumentosObrigatoriosConvenio(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<FluxodocsDocumentoObrigatorioConvenio>>(`${ENDPOINT}/${id}`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function createDocumentosObrigatoriosConvenio(data: CreateFluxodocsDocumentoObrigatorioConvenioDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<FluxodocsDocumentoObrigatorioConvenio>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: FluxodocsDocumentoObrigatorioConvenio = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsDocumentoObrigatorioConvenio;
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function updateDocumentosObrigatoriosConvenio(id: number, data: UpdateFluxodocsDocumentoObrigatorioConvenioDTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<FluxodocsDocumentoObrigatorioConvenio>>(`${ENDPOINT}/${id}`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: FluxodocsDocumentoObrigatorioConvenio = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as FluxodocsDocumentoObrigatorioConvenio;
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivateDocumentosObrigatoriosConvenio(id: number) {
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
