/**
 * Serviço mock em memória para Procedimentos.
 */
import type {
  Procedimento,
  CreateProcedimentoDTO,
  UpdateProcedimentoDTO,
} from "@/types/entities/Procedimento";

const MOCK_USER = 1;

function nowISO() {
  return new Date().toISOString();
}

const baseSeed: Array<Partial<Procedimento> & { nome: string; grupoId: number }> = [
  { nome: "Consulta Clínica Geral", grupoId: 1, codigoTabAmb: "10101012" },
  { nome: "Consulta Pediátrica", grupoId: 1, codigoTabAmb: "10101020" },
  { nome: "Consulta Cardiológica", grupoId: 1, codigoTabAmb: "10101039" },
  { nome: "Hemograma Completo", grupoId: 2, codigoTabAmb: "40301110" },
  { nome: "Glicemia em Jejum", grupoId: 2, codigoTabAmb: "40302125" },
  { nome: "TSH", grupoId: 2, codigoTabAmb: "40316150" },
  { nome: "Colesterol Total", grupoId: 2, codigoTabAmb: "40302010" },
  { nome: "Raio-X Tórax PA", grupoId: 3, codigoTabAmb: "40801187" },
  { nome: "Ultrassom Abdominal Total", grupoId: 3, codigoTabAmb: "40901114" },
  { nome: "Tomografia de Crânio", grupoId: 3, codigoTabAmb: "41001028" },
  { nome: "Ressonância Magnética Coluna", grupoId: 3, codigoTabAmb: "41101030" },
  { nome: "Eletrocardiograma", grupoId: 3, codigoTabAmb: "40701076" },
  { nome: "Apendicectomia", grupoId: 4, codigoTabAmb: "31003078" },
  { nome: "Colecistectomia Videolaparoscópica", grupoId: 4, codigoTabAmb: "31005119" },
  { nome: "Sessão de Fisioterapia Motora", grupoId: 5, codigoTabAmb: "20102023" },
  { nome: "Sessão de Fisioterapia Respiratória", grupoId: 5, codigoTabAmb: "20102031" },
  { nome: "Atendimento Psicológico", grupoId: 6, codigoTabAmb: "50000110" },
  { nome: "Sessão de Fonoaudiologia", grupoId: 6, codigoTabAmb: "50000200" },
  { nome: "Vacina Tríplice Viral", grupoId: 1, codigoTabAmb: "60010012" },
  { nome: "Vacina Influenza", grupoId: 1, codigoTabAmb: "60010020" },
  { nome: "Endoscopia Digestiva Alta", grupoId: 3, codigoTabAmb: "42001018" },
  { nome: "Mamografia Bilateral", grupoId: 3, codigoTabAmb: "40802043" },
];

function seed(): Procedimento[] {
  return baseSeed.map((b, i) => ({
    id: i + 1,
    nome: b.nome,
    grupoId: b.grupoId,
    anotacaoFolha: null,
    diasEntrega: 1,
    procedimentoModuloUtilizacaoId: 1,
    apelido: null,
    codigoTabAmb: b.codigoTabAmb ?? null,
    situacaoId: 1,

    faturaTipoCobrancaFaturaValorId: 2,
    procedimentoSubGrupoId: 1,
    usaGuiaOutrasDespesas: false,
    usaGuiaResumoInternacao: false,
    usaGuiaSadt: true,
    usaGuiaHonorarioIndividual: false,
    usaGuiaConsulta: false,
    abaFaturamentoPadrao: 1,
    consideraComoMatMed: false,

    susCodigoProcedimento: `SUS${String(100000 + i)}`,
    susNomeProcedimento: b.nome,
    susSexo: "0",
    susPermanenciaMedia: 0,
    susPermanenciaTempo: 0,
    susPermanenciaMaximo: 0,
    susPontos: 0,
    susIdadeMinimaMeses: 0,
    susIdadeMaximaMeses: 1200,
    susGrupoId: null,
    susSubgrupoId: null,
    susFormaOrganizacao: "01",
    susModalidade: "01",
    susSistemaFaturamento: 1,
    procedimentoPrincipal: false,
    susPreencheAihParto: false,
    susPreencheAihLaqueaduraVasectomia: false,
    susPreencheAihOpme: false,
    susPreencheAihUtiNeoNatal: false,
    susPreencheAihRegistroCivil: false,
    cihaTipoProcedimento: "0",
    susPreencheApacTipo: 1,

    nomeLaudo: b.nome,
    digitaLaudo: false,
    origemLaudo: 0,
    laudoMetaFormularioId: null,
    responsavelAssinaturaLaudo: 1,

    produtividadeSolicitantePaga: false,
    regraPagamentoProdutividade: 1,
    regraPagamentoProfissionalEspecifico: null,

    mostraTelaAtenderProcedimento: true,
    sadtMostraData: true,
    fichaAtendimentoImpressaUrlModelo: null,
    sumarioAltaHabilitado: false,
    habilitaRelAgendamento: true,

    homeCareVlCusto: null,
    hcaaCodigo: null,
    grupoAgendaSessoesId: null,

    prescricaoTipoId: 1,
    seraUtilizadoAso: false,
    prescricaoHabilitaDescricaoCentroCirurgico: false,
    prescricaoHabilitaDescricaoCirurgicaBeiraLeito: false,
    geraEquipeAutomaticamente: false,
    permiteLancarEquipe: false,
    comboProcedimentos: false,
    estqArtigoId: null,

    userId: MOCK_USER,
    userModified: MOCK_USER,
    created: nowISO(),
    modified: nowISO(),
  }));
}

let store: Procedimento[] = seed();
let nextId = store.length + 1;

export async function fetchProcedimentos(): Promise<Procedimento[]> {
  return [...store];
}

export async function fetchProcedimento(
  id: number,
): Promise<Procedimento | null> {
  return store.find((p) => p.id === id) ?? null;
}

export async function createProcedimento(
  data: CreateProcedimentoDTO,
): Promise<Procedimento> {
  const dup = store.some(
    (p) =>
      p.situacaoId === 1 &&
      p.nome.trim().toLowerCase() === data.nome.trim().toLowerCase(),
  );
  if (dup) throw new Error("Já existe procedimento ativo com este Nome");

  const created: Procedimento = {
    ...data,
    id: nextId++,
    userId: MOCK_USER,
    userModified: MOCK_USER,
    created: nowISO(),
    modified: nowISO(),
  };
  store = [created, ...store];
  return created;
}

export async function updateProcedimento(
  id: number,
  data: UpdateProcedimentoDTO,
): Promise<Procedimento> {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Procedimento não encontrado");

  if (data.nome) {
    const dup = store.some(
      (p) =>
        p.id !== id &&
        p.situacaoId === 1 &&
        p.nome.trim().toLowerCase() === data.nome!.trim().toLowerCase(),
    );
    if (dup) throw new Error("Já existe procedimento ativo com este Nome");
  }

  const updated: Procedimento = {
    ...store[idx],
    ...data,
    userModified: MOCK_USER,
    modified: nowISO(),
  };
  store[idx] = updated;
  return updated;
}

export async function inactivateProcedimento(id: number): Promise<void> {
  const idx = store.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Procedimento não encontrado");
  store[idx] = {
    ...store[idx],
    situacaoId: 2,
    userModified: MOCK_USER,
    modified: nowISO(),
  };
}
