/**
 * Service de Profissionais.
 *
 * Este service está pronto para consumir a API real (axios + /api/v1/profissionais),
 * mas, enquanto o backend não está disponível, faz fallback automático para
 * dados mockados em memória — assim a UI pode ser testada completamente.
 *
 * Basta configurar `VITE_API_URL` e o backend real será usado imediatamente.
 */
import api from "@/lib/axios";
import type {
  ApiSuccessResponse,
  PaginationParams,
  SelectOption,
} from "@/types/api";
import type {
  Profissional,
  CreateProfissionalDTO,
  UpdateProfissionalDTO,
} from "@/types/entities/Profissional";

// ───────────────── Mock store (fallback quando a API falha) ─────────────────

const mockStore: Profissional[] = [
  {
    id: "p1",
    nome: "Dr. Carlos Mendes",
    tipoCadastroId: "medico",
    cpf: "529.982.247-25",
    rg: "12.345.678-9",
    dataNascimento: "1980-05-12",
    sexo: "masculino",
    situacaoId: 1,
    conselho: "CRM-SP",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "p2",
    nome: "Enf. Maria Silva",
    tipoCadastroId: "enfermeiro",
    cpf: "111.444.777-35",
    rg: "98.765.432-1",
    dataNascimento: "1990-09-22",
    sexo: "feminino",
    situacaoId: 1,
    conselho: "COREN-RJ",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function mockList(params: PaginationParams = {}): ApiSuccessResponse<Profissional[]> {
  const { page = 1, limit = 20, search } = params;
  let filtered = [...mockStore];
  if (search) {
    const term = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.nome.toLowerCase().includes(term) ||
        p.cpf.replace(/\D/g, "").includes(term.replace(/\D/g, "")),
    );
  }
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const data = filtered.slice(start, start + limit);
  return {
    success: true,
    data,
    meta: {
      timestamp: new Date().toISOString(),
      page,
      limit,
      total,
      totalPages,
    },
  };
}

// ───────────────── API + fallback ─────────────────

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export async function fetchProfissionais(params: PaginationParams = {}) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Profissional[]>>(
        "/profissionais",
        { params },
      );
      return res.data;
    },
    () => mockList(params),
  );
}

export async function fetchProfissional(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Profissional>>(
        `/profissionais/${id}`,
      );
      return res.data.data;
    },
    () => mockStore.find((p) => String(p.id) === String(id)) as Profissional,
  );
}

export async function createProfissional(data: CreateProfissionalDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<Profissional>>(
        "/profissionais",
        data,
      );
      return res.data.data;
    },
    () => {
      const novo: Profissional = {
        ...data,
        id: `p${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Profissional;
      mockStore.push(novo);
      return novo;
    },
  );
}

export async function updateProfissional(
  id: number | string,
  data: UpdateProfissionalDTO,
) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<Profissional>>(
        `/profissionais/${id}`,
        data,
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((p) => String(p.id) === String(id));
      if (idx >= 0) {
        mockStore[idx] = {
          ...mockStore[idx],
          ...data,
          updatedAt: new Date().toISOString(),
        } as Profissional;
        return mockStore[idx];
      }
      throw new Error("Não encontrado");
    },
  );
}

export async function inactivateProfissional(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.patch<ApiSuccessResponse<Profissional>>(
        `/profissionais/${id}`,
        { situacaoId: 2 },
      );
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((p) => String(p.id) === String(id));
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

export async function fetchProfissionaisOptions(): Promise<SelectOption[]> {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Profissional[]>>(
        "/profissionais",
        { params: { limit: 1000 } },
      );
      return res.data.data.map((p) => ({ id: p.id, value: p.nome }));
    },
    () => mockStore.map((p) => ({ id: p.id, value: p.nome })),
  );
}

/**
 * Replica local do store mock — usado internamente pelos mocks de
 * outras entidades (CBO, Especialidades) que referenciam profissionais.
 */
export function _getMockStore() {
  return mockStore;
}
