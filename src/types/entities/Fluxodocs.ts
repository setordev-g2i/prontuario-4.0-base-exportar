/**
 * Tipos compartilhados do módulo Fluxo de Documentos.
 * Cada entidade fluxodocs_* mantém seu próprio arquivo, mas todas
 * herdam os campos padrão de auditoria/situação definidos aqui.
 */

export interface FluxodocsBase {
  id: number;
  situacaoId: number;
  userCreatedId: number | null;
  created: string;
  userModifiedId: number | null;
  modified: string;
}

export type FluxodocsCreateBase<T extends FluxodocsBase> = Omit<
  T,
  "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified"
>;

export type FluxodocsUpdateBase<T extends FluxodocsBase> = Partial<
  FluxodocsCreateBase<T>
>;

/* Entidades simples (cadastros) */

export interface FluxodocsSetor extends FluxodocsBase {
  nome: string;
  sigla: string;
  cor: string;
  responsavelId: number | null;
  participaFluxo: boolean;
}

export interface FluxodocsTipoDocumento extends FluxodocsBase {
  nome: string;
  categoria: string;
  cor: string;
}

export interface FluxodocsMotivo extends FluxodocsBase {
  nome: string;
  tipo: string; // ENVIO | DEVOLUCAO | CANCELAMENTO | REENVIO | JUSTIFICATIVA
}

export interface FluxodocsTipoMovimentacao extends FluxodocsBase {
  nome: string;
  codigo: string;
  descricao: string;
  ordem: number;
}

export interface FluxodocsPrioridade extends FluxodocsBase {
  nome: string;
  codigo: string;
  peso: number;
  cor: string;
  ordem: number;
}

export interface FluxodocsStatus extends FluxodocsBase {
  nome: string;
  codigo: string;
  tipo: string;
  ordem: number;
  cor: string;
  permiteEdicao: boolean;
  finalizador: boolean;
}

export interface FluxodocsTipoItem extends FluxodocsBase {
  nome: string;
  codigo: string;
  descricao: string;
  ordem: number;
}

export interface FluxodocsStatusItem extends FluxodocsBase {
  nome: string;
  codigo: string;
  ordem: number;
  cor: string;
  finalizador: boolean;
}

/* Workflow */

export interface FluxodocsRegraFluxo extends FluxodocsBase {
  setorOrigemId: number;
  setorDestinoId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId: number;
}

export interface FluxodocsParametroSla extends FluxodocsBase {
  tipoDocumentoId: number | null;
  setorDestinoId: number | null;
  prioridadeId: number | null;
  convenioId: number | null;
  prazoHoras: number;
}

export interface FluxodocsParametroIa extends FluxodocsBase {
  nome: string;
  chave: string;
  valor: string;
}

export interface FluxodocsWorkflowTipoDocumento extends FluxodocsBase {
  tipoDocumentoId: number;
  nome: string;
  descricao: string;
}

export interface FluxodocsWorkflowEtapa extends FluxodocsBase {
  workflowId: number;
  statusOrigemId: number;
  statusDestinoId: number;
  acao: string;
  ordem: number;
  exigeMotivo: boolean;
  exigeObservacao: boolean;
  permiteReversao: boolean;
  perfilPermitido: string;
}

/* Documentação */

export interface FluxodocsDocumentoObrigatorioConvenio extends FluxodocsBase {
  convenioId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId: number | null;
  prioridadeId: number | null;
  obrigatorio: boolean;
  bloqueiaEnvio: boolean;
  exigeJustificativaAusencia: boolean;
  exigeAprovacaoJustificativa: boolean;
  descricao: string;
}

export interface FluxodocsChecklistDocumental extends FluxodocsBase {
  protocoloId: number;
  itemId: number;
  convenioId: number | null;
  tipoDocumentoId: number;
  documentoObrigatorioId: number | null;
  statusChecklist: string; // PENDENTE | ANEXADO | CONFIRMADO | JUSTIFICADO | BLOQUEANTE
  documentoAnexadoId: number | null;
  justificativaAusencia: string;
  iaSugestao: string;
  iaRiscoGlosa: number;
}

export interface FluxodocsAprovacaoJustificativa extends FluxodocsBase {
  checklistId: number;
  protocoloId: number;
  itemId: number;
  justificativa: string;
  statusAprovacao: string; // PENDENTE | APROVADO | REPROVADO | CANCELADO
  solicitadoPorId: number | null;
  solicitadoEm: string;
  aprovadoPorId: number | null;
  aprovadoEm: string | null;
  observacaoAprovador: string;
}

/* Operacional */

export interface FluxodocsProtocolo extends FluxodocsBase {
  numero: string;
  tipoMovimentacaoId: number;
  setorOrigemId: number;
  setorDestinoId: number;
  prioridadeId: number;
  motivoId: number | null;
  statusId: number;
  observacao: string;
  slaPrevistoEm: string | null;
  slaRealizadoEm: string | null;
  slaStatus: string;
  iaRiscoAtraso: number;
  iaScoreComplexidade: number;
  iaScorePrioridade: number;
  iaRecomendacao: string;
  ordemFila: number;
  protocoloOrigemId: number | null;
}

export interface FluxodocsProtocoloItem extends FluxodocsBase {
  protocoloId: number;
  tipoItemId: number;
  tipoDocumentoId: number | null;
  contaId: number | null;
  atendimentoId: number | null;
  clienteId: number | null;
  convenioId: number | null;
  descricaoManual: string;
  statusItemId: number;
  motivoDevolucaoId: number | null;
  observacao: string;
  iaProbabilidadeGlosa: number;
  iaSugestaoDevolucao: string;
}

/* Log */

export interface FluxodocsLog extends FluxodocsBase {
  protocoloId: number | null;
  usuarioId: number | null;
  setorId: number | null;
  acao: string;
  payload: string;
}
