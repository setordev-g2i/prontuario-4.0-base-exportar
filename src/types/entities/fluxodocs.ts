/**
 * Entidades do módulo Fluxo de Documentos (fluxodocs_*).
 * Etapa 1 — apenas estrutura de cadastros e configurações.
 *
 * Convenção: campos snake_case do banco viram camelCase na API/front.
 * Auditoria: situacaoId, userCreatedId, created, userModifiedId, modified
 *   (não exibidos em formulários, somente em "Informações do Registro").
 */

export type SituacaoId = 1 | 2;

export interface AuditMeta {
  situacaoId: SituacaoId;
  userCreatedId?: number | null;
  created?: string | null;
  userModifiedId?: number | null;
  modified?: string | null;
}

/* ── 3. Tipo de Movimentação ── */
export interface FluxodocsTipoMovimentacao extends AuditMeta {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string | null;
  ordem: number;
}

/* ── 4. Prioridade ── */
export interface FluxodocsPrioridade extends AuditMeta {
  id: number;
  nome: string;
  codigo: string;
  peso: number;
  cor: string;
  ordem: number;
}

/* ── 5. Status do Fluxo ── */
export interface FluxodocsStatus extends AuditMeta {
  id: number;
  nome: string;
  codigo: string;
  tipo: string; // ABERTO | EM_TRANSITO | FECHADO etc
  ordem: number;
  cor: string;
  permiteEdicao: boolean;
  finalizador: boolean;
}

/* ── 6. Tipo de Item ── */
export interface FluxodocsTipoItem extends AuditMeta {
  id: number;
  nome: string;
  codigo: string;
  descricao?: string | null;
  ordem: number;
}

/* ── 7. Status do Item ── */
export interface FluxodocsStatusItem extends AuditMeta {
  id: number;
  nome: string;
  codigo: string;
  ordem: number;
  cor: string;
  finalizador: boolean;
}

/* ── 8. Setor ── */
export interface FluxodocsSetor extends AuditMeta {
  id: number;
  nome: string;
  sigla: string;
  cor: string;
  responsavelId?: number | null;
  participaFluxo: boolean;
}

/* ── 9. Tipo de Documento ── */
export interface FluxodocsTipoDocumento extends AuditMeta {
  id: number;
  nome: string;
  categoria: string;
  cor: string;
}

/* ── 10. Motivo ── */
export interface FluxodocsMotivo extends AuditMeta {
  id: number;
  nome: string;
  tipo: string; // ENVIO | DEVOLUCAO | CANCELAMENTO | REENVIO | JUSTIFICATIVA
}

/* ── 11. Regra de Fluxo (origem→destino por tipo doc + movimentação) ── */
export interface FluxodocsRegraFluxo extends AuditMeta {
  id: number;
  setorOrigemId: number;
  setorDestinoId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId: number;
}

/* ── 12. Parâmetro SLA ── */
export interface FluxodocsParametroSla extends AuditMeta {
  id: number;
  tipoDocumentoId: number;
  setorDestinoId?: number | null;
  prioridadeId: number;
  convenioId?: number | null;
  prazoHoras: number;
}

/* ── 13. Parâmetro IA ── */
export interface FluxodocsParametroIa extends AuditMeta {
  id: number;
  nome: string;
  chave: string;
  valor: string;
}

/* ── 14. Workflow por Tipo de Documento ── */
export interface FluxodocsWorkflowTipoDocumento extends AuditMeta {
  id: number;
  tipoDocumentoId: number;
  nome: string;
  descricao?: string | null;
}

/* ── 15. Workflow Etapa (transição de status) ── */
export interface FluxodocsWorkflowEtapa extends AuditMeta {
  id: number;
  workflowId: number;
  statusOrigemId: number;
  statusDestinoId: number;
  acao: string;
  ordem: number;
  exigeMotivo: boolean;
  exigeObservacao: boolean;
  permiteReversao: boolean;
  perfilPermitido?: string | null;
}

/* ── 16. Documentação por Convênio ── */
export interface FluxodocsDocObrigatorioConvenio extends AuditMeta {
  id: number;
  convenioId: number;
  tipoDocumentoId: number;
  tipoMovimentacaoId?: number | null;
  prioridadeId?: number | null;
  obrigatorio: boolean;
  bloqueiaEnvio: boolean;
  exigeJustificativaAusencia: boolean;
  exigeAprovacaoJustificativa: boolean;
  descricao?: string | null;
}

/* ─────────── Constantes auxiliares (convênios mock) ─────────── */
export const CONVENIO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Particular" },
  { id: 2, value: "Unimed" },
  { id: 3, value: "Bradesco Saúde" },
  { id: 4, value: "Amil" },
  { id: 5, value: "SulAmérica" },
  { id: 6, value: "Hapvida" },
  { id: 7, value: "Notre Dame Intermédica" },
  { id: 8, value: "Porto Seguro Saúde" },
];

export const TIPOS_MOTIVO = [
  "ENVIO",
  "DEVOLUCAO",
  "CANCELAMENTO",
  "REENVIO",
  "JUSTIFICATIVA",
] as const;

export const TIPOS_STATUS = [
  "ABERTO",
  "EM_TRANSITO",
  "RECEBIDO",
  "DEVOLVIDO",
  "FECHADO",
  "CANCELADO",
] as const;

export const CATEGORIAS_DOCUMENTO = [
  "FATURAMENTO",
  "PRONTUARIO",
  "ADMINISTRATIVO",
  "JURIDICO",
  "FINANCEIRO",
  "OUTROS",
] as const;
