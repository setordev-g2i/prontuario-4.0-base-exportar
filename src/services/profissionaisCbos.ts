/**
 * Service de vínculos CBO ↔ Profissional.
 * Fallback em memória enquanto a API real não existe.
 */
import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  ProfissionalCbo,
  CreateProfissionalCboDTO,
  UpdateProfissionalCboDTO,
} from "@/types/entities/ProfissionalCbo";

export const CBO_OPTIONS = [
  { id: "225125", value: "225125 - Médico Clínico" },
  { id: "225170", value: "225170 - Médico Generalista" },
  { id: "225250", value: "225250 - Médico Ginecologista e Obstetra" },
  { id: "225270", value: "225270 - Médico Ortopedista" },
  { id: "225275", value: "225275 - Médico Otorrinolaringologista" },
  { id: "225280", value: "225280 - Médico Pediatra" },
  { id: "225320", value: "225320 - Médico Psiquiatra" },
  { id: "223505", value: "223505 - Enfermeiro" },
  { id: "223510", value: "223510 - Enfermeiro Auditor" },
  { id: "223515", value: "223515 - Enfermeiro de Estratégia de Saúde da Família" },
];

const mockStore: ProfissionalCbo[] = [
  {
    id: "cbo1",
    profissionalId: "p1",
    cboId: "225125",
    situacaoId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cbo2",
    profissionalId: "p1",
    cboId: "225170",
    situacaoId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "cbo3",
    profissionalId: "p2",
    cboId: "223505",
    situacaoId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export async function fetchProfissionalCbos(profissionalId?: number | string) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<ProfissionalCbo[]>>(
        "/profissionais-cbos",
        { params: { profissionalId } },
      );
      return res.data.data;
    },
    () =>
      profissionalId
        ? mockStore.filter((c) => String(c.profissionalId) === String(profissionalId))
        : [...mockStore],
  );
}

export async function createProfissionalCbo(data: CreateProfissionalCboDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<ProfissionalCbo>>(
        "/profissionais-cbos",
        data,
      );
      return res.data.data;
    },
    () => {
      const novo: ProfissionalCbo = {
        ...data,
        id: `cbo${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStore.push(novo);
      return novo;
    },
  );
}

export async function updateProfissionalCbo(
  id: number | string,
  data: UpdateProfissionalCboDTO,
) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<ProfissionalCbo>>(
        `/profissionais-cbos/${id}`,
        data,
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((c) => String(c.id) === String(id));
      if (idx >= 0) {
        mockStore[idx] = {
          ...mockStore[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        };
        return mockStore[idx];
      }
      throw new Error("Não encontrado");
    },
  );
}

export async function inactivateProfissionalCbo(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.patch<ApiSuccessResponse<ProfissionalCbo>>(
        `/profissionais-cbos/${id}`,
        { situacaoId: 2 },
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((c) => String(c.id) === String(id));
      if (idx >= 0) {
        mockStore[idx] = {
          ...mockStore[idx],
          situacaoId: 2,
          updatedAt: new Date().toISOString(),
        };
        return mockStore[idx];
      }
      throw new Error("Não encontrado");
    },
  );
}

export function cboLabel(id: string) {
  return CBO_OPTIONS.find((c) => c.id === id)?.value ?? id;
}
