/**
 * Tipos das entidades do módulo Fluxo de Documentos.
 * Todas as entidades fluxodocs_* compartilham os campos de auditoria abaixo.
 */

export interface FluxodocsAudit {
  id: number;
  situacaoId: 1 | 2;
  userCreatedId: number | null;
  created: string;
  userModifiedId: number | null;
  modified: string;
}

// 3. fluxodocs_tipo_movimentacao
export interface FluxodocsTipoMovimentacao extends FluxodocsAudit {
  nome: string;
  codigo: string;
  descricao: string | null;
  ordem: number;
}

// 4. fluxodocs_prioridade
export interface FluxodocsPrioridade extends FluxodocsAudit {
  nome: string;
  codigo: string;
  peso: number;
  cor: string;
  ordem: number;
}

// 5. fluxodocs_status
export interface FluxodocsStatus extends FluxodocsAudit {
  nome: string;
  codigo: string;
  tipo: string;
  ordem: number;
  cor: string;
  permiteEdicao: boolean;
  finalizador: boolean;
}

// 6. fluxodocs_tipo_item
export interface FluxodocsTipoItem extends FluxodocsAudit {
  nome: string;
  codigo: string;
  descricao: string | null;
  ordem: number;
}

// 7. fluxodocs_status_item
export interface FluxodocsStatusItem extends FluxodocsAudit {
  nome: string;
  codigo: string;
  ordem: number;
  cor: string;
  finalizador: boolean;
}

// 8. fluxodocs_setor
export interface FluxodocsSetor extends FluxodocsAudit {
  nome: string;
  sigla: string;
  cor: string;
  responsavelId: number | null;
  participaFluxo: boolean;
}

// 9. fluxodocs_tipo_documento
export interface FluxodocsTipoDocumento extends FluxodocsAudit {
  nome: string;
  categoria: string;
  cor: string;
}

// 10. fluxodocs_motivo
export interface FluxodocsMotivo extends FluxodocsAudit {
  nome: string;
  tipo: string;
}

// 11. fluxodocs_regra_fluxo
export interface FluxodocsRegraFluxo extends FluxodocsAudit {
  setorOrigemId: number;
  setorDestinoId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId: number;
}

// 12. fluxodocs_parametro_sla
export interface FluxodocsParametroSla extends FluxodocsAudit {
  tipoDocumentoId: number;
  setorDestinoId: number | null;
  prioridadeId: number;
  convenioId: number | null;
  prazoHoras: number;
}

// 13. fluxodocs_parametro_ia
export interface FluxodocsParametroIa extends FluxodocsAudit {
  nome: string;
  chave: string;
  valor: string;
}

// 14. fluxodocs_workflow_tipo_documento
export interface FluxodocsWorkflowTipoDocumento extends FluxodocsAudit {
  tipoDocumentoId: number;
  nome: string;
  descricao: string | null;
}

// 15. fluxodocs_workflow_etapa
export interface FluxodocsWorkflowEtapa extends FluxodocsAudit {
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

// 16. fluxodocs_documento_obrigatorio_convenio
export interface FluxodocsDocumentoObrigatorioConvenio extends FluxodocsAudit {
  convenioId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId: number | null;
  prioridadeId: number | null;
  obrigatorio: boolean;
  bloqueiaEnvio: boolean;
  exigeJustificativaAusencia: boolean;
  exigeAprovacaoJustificativa: boolean;
  descricao: string | null;
}

// 17. fluxodocs_checklist_documental
export interface FluxodocsChecklistDocumental extends FluxodocsAudit {
  protocoloId: number;
  itemId: number | null;
  convenioId: number | null;
  tipoDocumentoId: number;
  documentoObrigatorioId: number | null;
  statusChecklist: "PENDENTE" | "ANEXADO" | "CONFIRMADO" | "JUSTIFICADO" | "BLOQUEANTE";
  documentoAnexadoId: number | null;
  justificativaAusencia: string | null;
  iaSugestao: string | null;
  iaRiscoGlosa: number | null;
}

// 18. fluxodocs_aprovacao_justificativa
export interface FluxodocsAprovacaoJustificativa extends FluxodocsAudit {
  checklistId: number;
  protocoloId: number;
  itemId: number | null;
  justificativa: string;
  statusAprovacao: "PENDENTE" | "APROVADO" | "REPROVADO" | "CANCELADO";
  solicitadoPorId: number;
  solicitadoEm: string;
  aprovadoPorId: number | null;
  aprovadoEm: string | null;
  observacaoAprovador: string | null;
}

// 1. fluxodocs_protocolo
export interface FluxodocsProtocolo extends FluxodocsAudit {
  numero: string;
  tipoMovimentacaoId: number;
  setorOrigemId: number;
  setorDestinoId: number;
  prioridadeId: number;
  motivoId: number | null;
  statusId: number;
  observacao: string | null;
  slaPrevistoEm: string | null;
  slaRealizadoEm: string | null;
  slaStatus: string | null;
  iaRiscoAtraso: number | null;
  iaScoreComplexidade: number | null;
  iaScorePrioridade: number | null;
  iaRecomendacao: string | null;
  ordemFila: number | null;
  protocoloOrigemId: number | null;
}

// 2. fluxodocs_protocolo_item
export interface FluxodocsProtocoloItem extends FluxodocsAudit {
  protocoloId: number;
  tipoItemId: number;
  tipoDocumentoId: number | null;
  contaId: number | null;
  atendimentoId: number | null;
  clienteId: number | null;
  convenioId: number | null;
  descricaoManual: string | null;
  statusItemId: number;
  motivoDevolucaoId: number | null;
  observacao: string | null;
  iaProbabilidadeGlosa: number | null;
  iaSugestaoDevolucao: string | null;
}

// 19. fluxodocs_log
export interface FluxodocsLog extends FluxodocsAudit {
  protocoloId: number | null;
  usuarioId: number | null;
  setorId: number | null;
  acao: string;
  payload: string | null;
}
