/**
 * Serviço mock em memória para Grupos de Procedimentos.
 * Simula CRUD completo no frontend, sem chamadas à API.
 */
import type {
  GrupoProcedimento,
  CreateGrupoProcedimentoDTO,
  UpdateGrupoProcedimentoDTO,
} from "@/types/entities/GrupoProcedimento";

const MOCK_USER_ID = "usuario.logado";

function nowISO() {
  return new Date().toISOString();
}

function seed(): GrupoProcedimento[] {
  const base: Partial<GrupoProcedimento>[] = [
    { codigoGrupo: "CONS", nome: "Consultas Médicas", color: "#3b82f6", procedimentoSubGrupoId: 2 },
    { codigoGrupo: "LAB", nome: "Exames Laboratoriais", color: "#10b981", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "IMG", nome: "Exames de Imagem", color: "#8b5cf6", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "CIRURG", nome: "Cirurgias Gerais", color: "#ef4444", procedimentoSubGrupoId: 4 },
    { codigoGrupo: "FISIO", nome: "Fisioterapia", color: "#f59e0b", procedimentoSubGrupoId: 5 },
    { codigoGrupo: "PSICO", nome: "Psicologia", color: "#ec4899", procedimentoSubGrupoId: 5 },
    { codigoGrupo: "FONO", nome: "Fonoaudiologia", color: "#14b8a6", procedimentoSubGrupoId: 5 },
    { codigoGrupo: "TO", nome: "Terapia Ocupacional", color: "#06b6d4", procedimentoSubGrupoId: 5 },
    { codigoGrupo: "RAIOX", nome: "Radiografias", color: "#6366f1", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "USG", nome: "Ultrassonografias", color: "#a855f7", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "TC", nome: "Tomografias", color: "#0ea5e9", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "RM", nome: "Ressonâncias", color: "#22c55e", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "ENDO", nome: "Endoscopia", color: "#eab308", procedimentoSubGrupoId: 3 },
    { codigoGrupo: "ANEST", nome: "Anestesia", color: "#f43f5e", procedimentoSubGrupoId: 4 },
    { codigoGrupo: "ORTO", nome: "Ortopedia", color: "#84cc16", procedimentoSubGrupoId: 4 },
    { codigoGrupo: "CARDI", nome: "Cardiologia", color: "#dc2626", procedimentoSubGrupoId: 2 },
    { codigoGrupo: "DERM", nome: "Dermatologia", color: "#fb923c", procedimentoSubGrupoId: 2 },
    { codigoGrupo: "PED", nome: "Pediatria", color: "#60a5fa", procedimentoSubGrupoId: 2 },
    { codigoGrupo: "GO", nome: "Ginecologia e Obstetrícia", color: "#f472b6", procedimentoSubGrupoId: 2 },
    { codigoGrupo: "NUTRI", nome: "Nutrição", color: "#34d399", procedimentoSubGrupoId: 5 },
    { codigoGrupo: "PADRAO", nome: "Procedimentos Padrão", color: "#94a3b8", procedimentoSubGrupoId: 1 },
    { codigoGrupo: "VAC", nome: "Vacinação", color: "#facc15", procedimentoSubGrupoId: 1 },
  ];
  return base.map((b, i) => ({
    id: i + 1,
    codigoGrupo: b.codigoGrupo!,
    nome: b.nome!,
    situacaoId: 1,
    color: b.color!,
    procedimentoSubGrupoId: b.procedimentoSubGrupoId!,
    percentualLucro: null,
    percentualDesconto: null,
    tipoDataFaturamento: null,
    faturaTabelaConvenioCapituloId: null,
    contabilidadeCodreduzido: null,
    utilizaInternacaoMapaImpressaoColunaAcomodacao: false,
    utilizaInternacaoMapaImpressaoColunaProcedimentos: false,
    relProducaoTotalizaMedico: false,
    relProducaoTotalizaMatmed: false,
    relProducaoRelExecutante: false,
    relProducaoRelSolicitante: false,
    homecareNomeGrupoRelatorio: null,
    homecareOrdemOrcamento: null,
    homecareListaEquipamentoRequisitar: false,
    modalidadedicom: null,
    userId: MOCK_USER_ID,
    created: nowISO(),
    modified: nowISO(),
  }));
}

let store: GrupoProcedimento[] = seed();
let nextId = store.length + 1;

export async function fetchGruposProcedimentos(): Promise<GrupoProcedimento[]> {
  return [...store];
}

export async function fetchGrupoProcedimento(
  id: number,
): Promise<GrupoProcedimento | null> {
  return store.find((g) => g.id === id) ?? null;
}

export async function createGrupoProcedimento(
  data: CreateGrupoProcedimentoDTO,
): Promise<GrupoProcedimento> {
  const codDup = store.some(
    (g) =>
      g.situacaoId === 1 &&
      g.codigoGrupo.toLowerCase() === data.codigoGrupo.toLowerCase(),
  );
  if (codDup) throw new Error("Já existe grupo ativo com este Código");

  const nomeDup = store.some(
    (g) => g.situacaoId === 1 && g.nome.toLowerCase() === data.nome.toLowerCase(),
  );
  if (nomeDup) throw new Error("Já existe grupo ativo com este Nome");

  const created: GrupoProcedimento = {
    ...data,
    id: nextId++,
    userId: MOCK_USER_ID,
    created: nowISO(),
    modified: nowISO(),
  };
  store = [created, ...store];
  return created;
}

export async function updateGrupoProcedimento(
  id: number,
  data: UpdateGrupoProcedimentoDTO,
): Promise<GrupoProcedimento> {
  const idx = store.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Grupo não encontrado");

  if (data.codigoGrupo) {
    const dup = store.some(
      (g) =>
        g.id !== id &&
        g.situacaoId === 1 &&
        g.codigoGrupo.toLowerCase() === data.codigoGrupo!.toLowerCase(),
    );
    if (dup) throw new Error("Já existe grupo ativo com este Código");
  }
  if (data.nome) {
    const dup = store.some(
      (g) =>
        g.id !== id &&
        g.situacaoId === 1 &&
        g.nome.toLowerCase() === data.nome!.toLowerCase(),
    );
    if (dup) throw new Error("Já existe grupo ativo com este Nome");
  }

  const updated: GrupoProcedimento = {
    ...store[idx],
    ...data,
    modified: nowISO(),
  };
  store[idx] = updated;
  return updated;
}

export async function inactivateGrupoProcedimento(id: number): Promise<void> {
  const idx = store.findIndex((g) => g.id === id);
  if (idx === -1) throw new Error("Grupo não encontrado");
  store[idx] = { ...store[idx], situacaoId: 2, modified: nowISO() };
}
