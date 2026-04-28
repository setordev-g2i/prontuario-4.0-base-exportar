/**
 * Serviço mock em memória para Produtividade do Profissional.
 * Simula CRUD completo no frontend, sem chamadas à API.
 */
import type {
  ProfissionalProdutividade,
  CreateProfissionalProdutividadeDTO,
  UpdateProfissionalProdutividadeDTO,
} from "@/types/entities/ProfissionalProdutividade";

const MOCK_USER_ID = 1;

export const CONVENIO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Particular" },
  { id: 2, value: "Unimed" },
  { id: 3, value: "Bradesco Saúde" },
  { id: 4, value: "Amil" },
  { id: 5, value: "SulAmérica" },
  { id: 6, value: "Hapvida" },
  { id: 7, value: "NotreDame Intermédica" },
  { id: 8, value: "SUS" },
];

function nowISO() {
  return new Date().toISOString();
}

const mockStore: ProfissionalProdutividade[] = [
  {
    id: "prod1",
    profissionalId: "p1",
    convenioId: 2,
    procedimentoId: 1,
    situacaoId: 1,
    percRecebimento: 70,
    percImposto: 11,
    vlFixo: 80,
    vigenciaInicial: "2025-01-01",
    vigenciaFinal: "2025-12-31",
    operacaoCreditoOuDebito: 1,
    userId: MOCK_USER_ID,
    created: nowISO(),
    modified: nowISO(),
  },
  {
    id: "prod2",
    profissionalId: "p1",
    convenioId: 1,
    procedimentoId: 3,
    situacaoId: 1,
    percRecebimento: 100,
    percImposto: 6,
    vlFixo: 250,
    vigenciaInicial: "2025-01-01",
    operacaoCreditoOuDebito: 1,
    userId: MOCK_USER_ID,
    created: nowISO(),
    modified: nowISO(),
  },
];

export async function fetchProdutividades(profissionalId: number | string) {
  return mockStore.filter(
    (p) => String(p.profissionalId) === String(profissionalId),
  );
}

export async function createProdutividade(
  data: CreateProfissionalProdutividadeDTO,
) {
  // Duplicidade ativa: profissional + convênio + procedimento
  const dup = mockStore.find(
    (p) =>
      String(p.profissionalId) === String(data.profissionalId) &&
      p.convenioId === data.convenioId &&
      p.procedimentoId === data.procedimentoId &&
      p.situacaoId === 1,
  );
  if (dup) {
    throw new Error(
      "Já existe um cadastro ativo para este Profissional + Convênio + Procedimento",
    );
  }
  const novo: ProfissionalProdutividade = {
    ...data,
    id: `prod${Date.now()}`,
    userId: MOCK_USER_ID,
    created: nowISO(),
    modified: nowISO(),
  };
  mockStore.push(novo);
  return novo;
}

export async function updateProdutividade(
  id: number | string,
  data: UpdateProfissionalProdutividadeDTO,
) {
  const idx = mockStore.findIndex((p) => String(p.id) === String(id));
  if (idx < 0) throw new Error("Não encontrado");

  // Duplicidade (ignorando o próprio registro)
  if (
    data.convenioId !== undefined &&
    data.procedimentoId !== undefined &&
    data.situacaoId === 1
  ) {
    const dup = mockStore.find(
      (p) =>
        String(p.id) !== String(id) &&
        String(p.profissionalId) === String(mockStore[idx].profissionalId) &&
        p.convenioId === data.convenioId &&
        p.procedimentoId === data.procedimentoId &&
        p.situacaoId === 1,
    );
    if (dup) {
      throw new Error(
        "Já existe um cadastro ativo para este Profissional + Convênio + Procedimento",
      );
    }
  }

  mockStore[idx] = {
    ...mockStore[idx],
    ...data,
    modified: nowISO(),
  };
  return mockStore[idx];
}

export async function inactivateProdutividade(id: number | string) {
  const idx = mockStore.findIndex((p) => String(p.id) === String(id));
  if (idx < 0) throw new Error("Não encontrado");
  mockStore[idx] = {
    ...mockStore[idx],
    situacaoId: 2,
    modified: nowISO(),
  };
  return mockStore[idx];
}

export function convenioLabel(id: number) {
  return CONVENIO_OPTIONS.find((c) => c.id === id)?.value ?? String(id);
}
