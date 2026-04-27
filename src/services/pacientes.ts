/**
 * Service de Pacientes.
 *
 * Pronto para consumir a API real (axios + /api/v1/pacientes),
 * com fallback automático para mock em memória enquanto o backend
 * não está disponível.
 */
import api from "@/lib/axios";
import type {
  ApiSuccessResponse,
  PaginationParams,
  SelectOption,
} from "@/types/api";
import type {
  Paciente,
  CreatePacienteDTO,
  UpdatePacienteDTO,
} from "@/types/entities/Paciente";

// ───────── Mock store ─────────
const mockStore: Paciente[] = [
  {
    id: "pc1",
    nome: "Ana Souza",
    cpf: "529.982.247-25",
    rg: "22.333.444-5",
    dataNascimento: "1992-03-14",
    sexo: "feminino",
    email: "ana.souza@example.com",
    celular: "(11) 98888-1111",
    situacaoId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "pc2",
    nome: "Bruno Almeida",
    cpf: "111.444.777-35",
    rg: "55.666.777-8",
    dataNascimento: "1985-11-02",
    sexo: "masculino",
    email: "bruno@example.com",
    celular: "(21) 97777-2222",
    situacaoId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function mockList(params: PaginationParams = {}): ApiSuccessResponse<Paciente[]> {
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

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback();
  }
}

export async function fetchPacientes(params: PaginationParams = {}) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Paciente[]>>("/pacientes", {
        params,
      });
      return res.data;
    },
    () => mockList(params),
  );
}

export async function fetchPaciente(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Paciente>>(`/pacientes/${id}`);
      return res.data.data;
    },
    () => mockStore.find((p) => String(p.id) === String(id)) as Paciente,
  );
}

export async function createPaciente(data: CreatePacienteDTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<Paciente>>("/pacientes", data);
      return res.data.data;
    },
    () => {
      const novo: Paciente = {
        ...data,
        id: `pc${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockStore.push(novo);
      return novo;
    },
  );
}

export async function updatePaciente(
  id: number | string,
  data: UpdatePacienteDTO,
) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<Paciente>>(
        `/pacientes/${id}`,
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
        };
        return mockStore[idx];
      }
      throw new Error("Paciente não encontrado");
    },
  );
}

export async function inactivatePaciente(id: number | string) {
  return tryApi(
    async () => {
      const res = await api.patch<ApiSuccessResponse<Paciente>>(
        `/pacientes/${id}`,
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
      throw new Error("Paciente não encontrado");
    },
  );
}

export async function fetchPacientesOptions(): Promise<SelectOption[]> {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<Paciente[]>>("/pacientes", {
        params: { limit: 1000 },
      });
      return res.data.data.map((p) => ({ id: p.id, value: p.nome }));
    },
    () => mockStore.map((p) => ({ id: p.id, value: p.nome })),
  );
}
