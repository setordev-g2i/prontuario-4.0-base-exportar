/**
 * Service de vínculos Especialidade ↔ Profissional.
 * Fallback em memória enquanto a API real não existe.
 */
import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type {
  ProfissionalEspecialidade,
  CreateProfissionalEspecialidadeDTO,
  UpdateProfissionalEspecialidadeDTO,
} from "@/types/entities/ProfissionalEspecialidade";

export const ESPECIALIDADE_OPTIONS = [
  { id: "1", value: "Clínica Médica" },
  { id: "2", value: "Cardiologia" },
  { id: "3", value: "Ortopedia" },
  { id: "4", value: "Pediatria" },
  { id: "5", value: "Ginecologia e Obstetrícia" },
  { id: "6", value: "Psiquiatria" },
  { id: "7", value: "Dermatologia" },
  { id: "8", value: "Neurologia" },
  { id: "9", value: "Enfermagem Geral" },
  { id: "10", value: "Enfermagem UTI" },
];

const mockStore: ProfissionalEspecialidade[] = [
  {
    id: "esp1",
    profissionalId: "p1",
    especialidadeId: "1",
    situacaoId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "esp2",
    profissionalId: "p1",
    especialidadeId: "2",
    situacaoId: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "esp3",
    profissionalId: "p2",
    especialidadeId: "9",
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

export async function fetchProfissionalEspecialidades(
  profissionalId?: number | string,
) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<ProfissionalEspecialidade[]>>(
        "/profissionais-especialidades",
        { params: { profissionalId } },
      );
      return res.data.data;
    },
    () =>
      profissionalId
        ? mockStore.filter(
            (e) => String(e.profissionalId) === String(profissionalId),
          )
        : [...mockStore],
  );
}

export async function createProfissionalEspecialidade(
  data: CreateProfissionalEspecialidadeDTO,
) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<ProfissionalEspecialidade>>(
        "/profissionais-especialidades",
        data,
      );
      return res.data.data;
    },
    () => {
      const novo: ProfissionalEspecialidade = {
        ...data,
        id: `esp${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStore.push(novo);
      return novo;
    },
  );
}

export async function updateProfissionalEspecialidade(
  id: number | string,
  data: UpdateProfissionalEspecialidadeDTO,
) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<ProfissionalEspecialidade>>(
        `/profissionais-especialidades/${id}`,
        data,
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((e) => String(e.id) === String(id));
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

export async function inactivateProfissionalEspecialidade(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.patch<ApiSuccessResponse<ProfissionalEspecialidade>>(
        `/profissionais-especialidades/${id}`,
        { situacaoId: 2 },
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((e) => String(e.id) === String(id));
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

export function especialidadeLabel(id: string) {
  return ESPECIALIDADE_OPTIONS.find((e) => e.id === id)?.value ?? id;
}
