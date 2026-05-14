/**
 * Service operacional do Fluxo de Documentos.
 * - Combina mocks da Etapa 1 (seedProtocolos/seedItens) com fluxos criados via wizard.
 * - Expõe createFluxo, updateStatus, receber, devolver, gravarLog, etc.
 * - Fornece versões "completas" agregando paciente/convênio/setor para a UI.
 */
import {
  seedProtocolos,
  seedProtocoloItens,
  seedSetores,
  seedPrioridades,
  seedStatus,
  seedTiposMovimentacao,
  seedTiposItem,
  seedTiposDocumento,
  seedMotivos,
  seedDocumentosObrigatoriosConvenio,
  seedAprovacoes,
  seedLogs,
  seedRegrasFluxo,
} from "@/lib/fluxodocsMocks";
import {
  protocolosOperacionais,
  itensOperacionais,
  logsOperacionais,
  nextProtocoloId,
  nextItemId,
  nextLogId,
  gerarNumeroFluxo,
  contasMock,
  atendimentosMock,
  clientesMock,
  conveniosMock,
} from "@/lib/fluxodocsOperacionalMocks";
import { calcularSla, statusSlaDeData } from "./fluxodocsSla";
import { calcularRisco, calcularScoreFila } from "./fluxodocsIa";
import type {
  FluxodocsProtocolo,
  FluxodocsProtocoloItem,
  FluxodocsLog,
  FluxodocsAprovacaoJustificativa,
} from "@/types/entities/Fluxodocs";
import type {
  NovoFluxoDraft,
  FluxoCompleto,
  RiscoNivel,
} from "@/types/entities/FluxodocsOperacional";

const NOW = () => new Date().toISOString();
const audit = (id: number) => ({
  id, situacaoId: 1 as const,
  userCreatedId: 1, created: NOW(),
  userModifiedId: 1, modified: NOW(),
});

// estado mutável global em memória (mock)
const protocolosBase = seedProtocolos();
const itensBase = seedProtocoloItens();
const aprovacoesBase = seedAprovacoes();
const logsBase = seedLogs();
const regras = seedRegrasFluxo();
const docsObrigConv = seedDocumentosObrigatoriosConvenio();

// referências auxiliares
export const setores = seedSetores();
export const prioridades = seedPrioridades();
export const statusFluxo = seedStatus();
export const tiposMov = seedTiposMovimentacao();
export const tiposItem = seedTiposItem();
export const tiposDoc = seedTiposDocumento();
export const motivos = seedMotivos();
export const documentosObrigatoriosConvenio = docsObrigConv;
export { contasMock, atendimentosMock, clientesMock, conveniosMock };

export const aprovacoesStore: FluxodocsAprovacaoJustificativa[] = [...aprovacoesBase];

function todosProtocolos(): FluxodocsProtocolo[] {
  return [...protocolosBase, ...protocolosOperacionais];
}
function todosItens(): FluxodocsProtocoloItem[] {
  return [...itensBase, ...itensOperacionais];
}
function todosLogs(): FluxodocsLog[] {
  return [...logsBase, ...logsOperacionais];
}

export function gravarLog(args: {
  protocoloId: number | null;
  acao: string;
  setorId?: number | null;
  payload?: Record<string, unknown>;
}): FluxodocsLog {
  const log: FluxodocsLog = {
    ...audit(nextLogId()),
    protocoloId: args.protocoloId,
    usuarioId: 1,
    setorId: args.setorId ?? null,
    acao: args.acao,
    payload: args.payload ? JSON.stringify(args.payload) : null,
  };
  logsOperacionais.push(log);
  return log;
}

export function validarRegraFluxo(
  setorOrigemId: number,
  setorDestinoId: number,
  tipoMovimentacaoId: number,
): boolean {
  return regras.some(r =>
    r.situacaoId === 1 &&
    r.setorOrigemId === setorOrigemId &&
    r.setorDestinoId === setorDestinoId &&
    r.tipoMovimentacaoId === tipoMovimentacaoId,
  );
}

export function gerarChecklistAutomatico(args: {
  convenioId: number | null;
  itensConvenioIds: (number | null)[];
}) {
  const conveniosUsados = new Set<number>();
  args.itensConvenioIds.forEach(c => { if (c) conveniosUsados.add(c); });
  if (args.convenioId) conveniosUsados.add(args.convenioId);

  const out: ReturnType<typeof toChecklistDraft>[] = [];
  conveniosUsados.forEach(convId => {
    docsObrigConv
      .filter(d => d.convenioId === convId && d.situacaoId === 1)
      .forEach(d => out.push(toChecklistDraft(d, convId)));
  });
  return out;
}

function toChecklistDraft(
  d: typeof docsObrigConv[number],
  convId: number,
) {
  return {
    uid: `chk-${d.id}-${convId}`,
    itemUid: null,
    tipoDocumentoId: d.tipoDocumentoId,
    documentoObrigatorioId: d.id,
    obrigatorio: d.obrigatorio,
    bloqueiaEnvio: d.bloqueiaEnvio,
    exigeAprovacao: d.exigeAprovacaoJustificativa,
    status: "PENDENTE" as const,
    justificativa: null,
    documentoNome: null,
    aprovacaoStatus: d.exigeAprovacaoJustificativa ? "NAO_APLICA" as const : "NAO_APLICA" as const,
  };
}

export interface CreateFluxoArgs {
  draft: NovoFluxoDraft;
  rascunho?: boolean;
}

export function createFluxo(args: CreateFluxoArgs): FluxoCompleto {
  const { draft, rascunho } = args;
  const protocoloId = nextProtocoloId();

  // SLA + IA agregado pelo primeiro item (ou geral)
  const primeiraConv = draft.itens.find(i => i.convenioId)?.convenioId
    ?? null;
  const tipoDocAlvo = draft.itens.find(i => i.tipoDocumentoId)?.tipoDocumentoId ?? null;
  const sla = calcularSla({
    convenioId: primeiraConv,
    tipoDocumentoId: tipoDocAlvo,
    setorDestinoId: draft.setorDestinoId!,
    prioridadeId: draft.prioridadeId!,
  });
  const risco = calcularRisco(draft.checklist, primeiraConv);

  const statusInicial = rascunho
    ? statusFluxo.find(s => s.codigo === "ABERTO")!
    : statusFluxo.find(s => s.codigo === "ENVIADO")!;

  const protocolo: FluxodocsProtocolo = {
    ...audit(protocoloId),
    numero: gerarNumeroFluxo(protocoloId),
    tipoMovimentacaoId: draft.tipoMovimentacaoId!,
    setorOrigemId: draft.setorOrigemId!,
    setorDestinoId: draft.setorDestinoId!,
    prioridadeId: draft.prioridadeId!,
    motivoId: draft.motivoId,
    statusId: statusInicial.id,
    observacao: draft.observacao || null,
    slaPrevistoEm: sla.slaPrevistoEm,
    slaRealizadoEm: null,
    slaStatus: sla.slaStatus,
    iaRiscoAtraso: sla.iaRiscoAtraso,
    iaScoreComplexidade: Math.round(Math.min(1, draft.itens.length / 10) * 100) / 100,
    iaScorePrioridade: (prioridades.find(p => p.id === draft.prioridadeId)?.peso ?? 1) / 10,
    iaRecomendacao: risco.recomendacao,
    ordemFila: null,
    protocoloOrigemId: null,
  };
  protocolosOperacionais.push(protocolo);

  draft.itens.forEach(it => {
    const item: FluxodocsProtocoloItem = {
      ...audit(nextItemId()),
      protocoloId,
      tipoItemId: tiposItem.find(t => t.codigo === it.tipoItem)?.id ?? 1,
      tipoDocumentoId: it.tipoDocumentoId,
      contaId: it.contaId,
      atendimentoId: it.atendimentoId,
      clienteId: it.clienteId,
      convenioId: it.convenioId,
      descricaoManual: it.descricaoManual,
      statusItemId: 1,
      motivoDevolucaoId: null,
      observacao: it.observacao,
      iaProbabilidadeGlosa: risco.riscoGlosa,
      iaSugestaoDevolucao: null,
    };
    itensOperacionais.push(item);
  });

  gravarLog({
    protocoloId,
    acao: "CRIADO",
    setorId: draft.setorOrigemId,
    payload: { numero: protocolo.numero, itens: draft.itens.length },
  });
  if (!rascunho) {
    gravarLog({ protocoloId, acao: "ENVIADO", setorId: draft.setorOrigemId });
  }
  if (draft.checklist.length) {
    gravarLog({ protocoloId, acao: "CHECKLIST_GERADO", payload: { itens: draft.checklist.length } });
  }
  gravarLog({ protocoloId, acao: "IA_SLA_CALCULADA", payload: { ...sla } });

  return enriquecerProtocolo(protocolo);
}

function enriquecerProtocolo(p: FluxodocsProtocolo): FluxoCompleto {
  const itensP = todosItens().filter(i => i.protocoloId === p.id);
  const setorO = setores.find(s => s.id === p.setorOrigemId);
  const setorD = setores.find(s => s.id === p.setorDestinoId);
  const pri = prioridades.find(x => x.id === p.prioridadeId);
  const st = statusFluxo.find(s => s.id === p.statusId);

  const itemConta = itensP.find(i => i.contaId);
  const conta = itemConta?.contaId ? contasMock.find(c => c.id === itemConta.contaId) ?? null : null;
  const cliente = itensP.find(i => i.clienteId)?.clienteId
    ? clientesMock.find(c => c.id === itensP.find(i => i.clienteId)!.clienteId!) ?? null
    : null;
  const conv = itensP.find(i => i.convenioId)?.convenioId
    ? conveniosMock.find(c => c.id === itensP.find(i => i.convenioId)!.convenioId!) ?? null
    : null;

  const slaHorasRestantes = p.slaPrevistoEm
    ? (new Date(p.slaPrevistoEm).getTime() - Date.now()) / 3600_000
    : 168;

  const score = calcularScoreFila({
    prioridadePeso: pri?.peso ?? 1,
    iaRiscoAtraso: p.iaRiscoAtraso ?? 0,
    iaRiscoGlosa: itensP[0]?.iaProbabilidadeGlosa ?? 0,
    iaComplexidade: p.iaScoreComplexidade ?? 0,
    convenioFator: conv ? (conv.historicoGlosa + conv.historicoAtraso) / 2 : 0.1,
    slaHorasRestantes,
  });

  const slaStatus = statusSlaDeData(p.slaPrevistoEm, p.iaRiscoAtraso ?? 0);
  let nivel: RiscoNivel = "BAIXO";
  if ((p.iaRiscoAtraso ?? 0) >= 0.7) nivel = "ALTO";
  else if ((p.iaRiscoAtraso ?? 0) >= 0.4) nivel = "MEDIO";

  return {
    protocolo: { ...p, slaStatus, ordemFila: null },
    itens: itensP,
    pacienteNome: cliente?.nome ?? null,
    convenioNome: conv?.nome ?? null,
    contaNumero: conta?.numero ?? null,
    setorOrigemNome: setorO?.nome ?? "—",
    setorDestinoNome: setorD?.nome ?? "—",
    prioridadeNome: pri?.nome ?? "—",
    prioridadeCor: pri?.cor ?? "#6b7280",
    statusNome: st?.nome ?? "—",
    statusCor: st?.cor ?? "#6b7280",
    scoreFila: score,
    riscoNivel: nivel,
    recomendacaoIa: p.iaRecomendacao ?? "Sem recomendação.",
  };
}

export function listarFluxosCompletos(opts?: { incluirFinalizadores?: boolean }): FluxoCompleto[] {
  return todosProtocolos()
    .filter(p => p.situacaoId === 1)
    .filter(p => {
      if (opts?.incluirFinalizadores) return true;
      const st = statusFluxo.find(s => s.id === p.statusId);
      return !st?.finalizador;
    })
    .map(enriquecerProtocolo);
}

export function listarFluxoPorId(id: number): FluxoCompleto | null {
  const p = todosProtocolos().find(x => x.id === id);
  return p ? enriquecerProtocolo(p) : null;
}

export function listarLogsPorProtocolo(protocoloId: number): FluxodocsLog[] {
  return todosLogs()
    .filter(l => l.protocoloId === protocoloId)
    .sort((a, b) => new Date(a.created).getTime() - new Date(b.created).getTime());
}

export function listarLogs(): FluxodocsLog[] {
  return todosLogs().sort((a, b) =>
    new Date(b.created).getTime() - new Date(a.created).getTime(),
  );
}

function alterarStatus(protocoloId: number, novoCodigo: string) {
  const idx = protocolosOperacionais.findIndex(p => p.id === protocoloId);
  if (idx >= 0) {
    const st = statusFluxo.find(s => s.codigo === novoCodigo);
    if (st) protocolosOperacionais[idx] = { ...protocolosOperacionais[idx], statusId: st.id, modified: NOW() };
    return;
  }
  const baseIdx = protocolosBase.findIndex(p => p.id === protocoloId);
  if (baseIdx >= 0) {
    const st = statusFluxo.find(s => s.codigo === novoCodigo);
    if (st) protocolosBase[baseIdx] = { ...protocolosBase[baseIdx], statusId: st.id, modified: NOW() };
  }
}

export function receberFluxo(protocoloId: number) {
  alterarStatus(protocoloId, "RECEBIDO");
  gravarLog({ protocoloId, acao: "RECEBIDO" });
}
export function aceitarParcial(protocoloId: number) {
  alterarStatus(protocoloId, "ACEITO_PARCIAL");
  gravarLog({ protocoloId, acao: "ACEITO_PARCIAL" });
}
export function devolverFluxo(protocoloId: number, motivo: string, observacao: string) {
  alterarStatus(protocoloId, "DEVOLVIDO");
  gravarLog({ protocoloId, acao: "DEVOLVIDO", payload: { motivo, observacao } });
}
export function reenviarFluxo(protocoloId: number) {
  alterarStatus(protocoloId, "REENVIADO");
  gravarLog({ protocoloId, acao: "REENVIADO" });
}
export function cancelarFluxo(protocoloId: number) {
  alterarStatus(protocoloId, "CANCELADO");
  gravarLog({ protocoloId, acao: "CANCELADO" });
}

export function repriorizarFluxo(protocoloId: number, novoPrioridadeId: number) {
  const idx = protocolosOperacionais.findIndex(p => p.id === protocoloId);
  if (idx >= 0) protocolosOperacionais[idx] = { ...protocolosOperacionais[idx], prioridadeId: novoPrioridadeId };
  else {
    const baseIdx = protocolosBase.findIndex(p => p.id === protocoloId);
    if (baseIdx >= 0) protocolosBase[baseIdx] = { ...protocolosBase[baseIdx], prioridadeId: novoPrioridadeId };
  }
  gravarLog({ protocoloId, acao: "IA_FILA_REORDENADA", payload: { prioridadeId: novoPrioridadeId } });
}

export function aprovarJustificativa(id: number, observacao?: string) {
  const idx = aprovacoesStore.findIndex(a => a.id === id);
  if (idx >= 0) {
    const a = aprovacoesStore[idx];
    aprovacoesStore[idx] = {
      ...a, statusAprovacao: "APROVADO", aprovadoPorId: 1,
      aprovadoEm: NOW(), observacaoAprovador: observacao ?? null,
    };
    gravarLog({ protocoloId: a.protocoloId, acao: "JUSTIFICATIVA_APROVADA", payload: { id } });
  }
}
export function reprovarJustificativa(id: number, observacao?: string) {
  const idx = aprovacoesStore.findIndex(a => a.id === id);
  if (idx >= 0) {
    const a = aprovacoesStore[idx];
    aprovacoesStore[idx] = {
      ...a, statusAprovacao: "REPROVADO", aprovadoPorId: 1,
      aprovadoEm: NOW(), observacaoAprovador: observacao ?? null,
    };
    gravarLog({ protocoloId: a.protocoloId, acao: "JUSTIFICATIVA_REPROVADA", payload: { id } });
  }
}
export function solicitarCorrecaoJustificativa(id: number, observacao?: string) {
  const idx = aprovacoesStore.findIndex(a => a.id === id);
  if (idx >= 0) {
    const a = aprovacoesStore[idx];
    aprovacoesStore[idx] = { ...a, observacaoAprovador: observacao ?? null };
    gravarLog({ protocoloId: a.protocoloId, acao: "JUSTIFICATIVA_APROVACAO_SOLICITADA", payload: { id, observacao } });
  }
}

export function listarAprovacoes(filtroStatus?: string): FluxodocsAprovacaoJustificativa[] {
  return aprovacoesStore
    .filter(a => !filtroStatus || a.statusAprovacao === filtroStatus)
    .sort((a, b) => new Date(b.solicitadoEm).getTime() - new Date(a.solicitadoEm).getTime());
}
