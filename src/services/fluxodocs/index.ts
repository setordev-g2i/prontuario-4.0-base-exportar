import { createCrud, nowISO } from "./_crud";
import type {
  FluxodocsTipoMovimentacao,
  FluxodocsPrioridade,
  FluxodocsStatus,
  FluxodocsTipoItem,
  FluxodocsStatusItem,
  FluxodocsSetor,
  FluxodocsTipoDocumento,
  FluxodocsMotivo,
  FluxodocsRegraFluxo,
  FluxodocsParametroSla,
  FluxodocsParametroIa,
  FluxodocsWorkflowTipoDocumento,
  FluxodocsWorkflowEtapa,
  FluxodocsDocObrigatorioConvenio,
} from "@/types/entities/fluxodocs";

const audit = (sit: 1 | 2 = 1) => ({
  situacaoId: sit,
  userCreatedId: 1,
  created: nowISO(),
  userModifiedId: 1,
  modified: nowISO(),
});

/* ─────────────── 3. Tipo de Movimentação (>20 com complementos) ─────────────── */
const tipoMovimentacaoSeed: FluxodocsTipoMovimentacao[] = [
  { id: 1, nome: "Envio", codigo: "ENVIO", descricao: "Envio inicial entre setores", ordem: 1, ...audit() },
  { id: 2, nome: "Remessa", codigo: "REMESSA", descricao: "Remessa em lote", ordem: 2, ...audit() },
  { id: 3, nome: "Devolução", codigo: "DEVOLUCAO", descricao: "Devolução por inconsistência", ordem: 3, ...audit() },
  { id: 4, nome: "Reenvio", codigo: "REENVIO", descricao: "Reenvio após correção", ordem: 4, ...audit() },
  { id: 5, nome: "Interno", codigo: "INTERNO", descricao: "Movimentação interna no setor", ordem: 5, ...audit() },
  { id: 6, nome: "Recebimento Manual", codigo: "RECEBIMENTO_MANUAL", descricao: "Entrada manual de documento", ordem: 6, ...audit() },
  { id: 7, nome: "Cancelamento", codigo: "CANCELAMENTO", descricao: "Cancelamento de protocolo", ordem: 7, ...audit() },
  { id: 8, nome: "Transferência", codigo: "TRANSFERENCIA", descricao: "Transferência entre filiais", ordem: 8, ...audit() },
  { id: 9, nome: "Arquivamento", codigo: "ARQUIVAMENTO", descricao: "Envio para arquivo morto", ordem: 9, ...audit() },
  { id: 10, nome: "Auditoria", codigo: "AUDITORIA", descricao: "Envio para auditoria", ordem: 10, ...audit() },
  ...Array.from({ length: 12 }, (_, i) => ({
    id: 11 + i,
    nome: `Movimentação Complementar ${i + 1}`,
    codigo: `MOV_COMPL_${i + 1}`,
    descricao: "Tipo cadastrado para teste",
    ordem: 11 + i,
    ...audit(),
  })),
];

/* ─────────────── 4. Prioridade ─────────────── */
const prioridadeSeed: FluxodocsPrioridade[] = [
  { id: 1, nome: "Normal", codigo: "NORMAL", peso: 1, cor: "#94a3b8", ordem: 1, ...audit() },
  { id: 2, nome: "Alta", codigo: "ALTA", peso: 5, cor: "#f59e0b", ordem: 2, ...audit() },
  { id: 3, nome: "Urgente", codigo: "URGENTE", peso: 10, cor: "#ef4444", ordem: 3, ...audit() },
  { id: 4, nome: "Crítica", codigo: "CRITICA", peso: 20, cor: "#7f1d1d", ordem: 4, ...audit() },
  { id: 5, nome: "Baixa", codigo: "BAIXA", peso: 0, cor: "#64748b", ordem: 5, ...audit() },
  ...Array.from({ length: 17 }, (_, i) => ({
    id: 6 + i,
    nome: `Prioridade Custom ${i + 1}`,
    codigo: `PRI_${i + 1}`,
    peso: i + 2,
    cor: "#6366f1",
    ordem: 6 + i,
    ...audit(),
  })),
];

/* ─────────────── 5. Status do Fluxo ─────────────── */
const statusSeed: FluxodocsStatus[] = [
  { id: 1, nome: "Aberto", codigo: "ABERTO", tipo: "ABERTO", ordem: 1, cor: "#3b82f6", permiteEdicao: true, finalizador: false, ...audit() },
  { id: 2, nome: "Em Trânsito", codigo: "EM_TRANSITO", tipo: "EM_TRANSITO", ordem: 2, cor: "#8b5cf6", permiteEdicao: false, finalizador: false, ...audit() },
  { id: 3, nome: "Recebido", codigo: "RECEBIDO", tipo: "RECEBIDO", ordem: 3, cor: "#10b981", permiteEdicao: true, finalizador: false, ...audit() },
  { id: 4, nome: "Devolvido", codigo: "DEVOLVIDO", tipo: "DEVOLVIDO", ordem: 4, cor: "#f59e0b", permiteEdicao: true, finalizador: false, ...audit() },
  { id: 5, nome: "Aceito Parcial", codigo: "ACEITO_PARCIAL", tipo: "RECEBIDO", ordem: 5, cor: "#14b8a6", permiteEdicao: true, finalizador: false, ...audit() },
  { id: 6, nome: "Reenviado", codigo: "REENVIADO", tipo: "EM_TRANSITO", ordem: 6, cor: "#06b6d4", permiteEdicao: false, finalizador: false, ...audit() },
  { id: 7, nome: "Finalizado", codigo: "FINALIZADO", tipo: "FECHADO", ordem: 7, cor: "#22c55e", permiteEdicao: false, finalizador: true, ...audit() },
  { id: 8, nome: "Cancelado", codigo: "CANCELADO", tipo: "CANCELADO", ordem: 8, cor: "#ef4444", permiteEdicao: false, finalizador: true, ...audit() },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: 9 + i,
    nome: `Status Custom ${i + 1}`,
    codigo: `ST_${i + 1}`,
    tipo: "ABERTO",
    ordem: 9 + i,
    cor: "#a3a3a3",
    permiteEdicao: true,
    finalizador: false,
    ...audit(),
  })),
];

/* ─────────────── 6. Tipo de Item ─────────────── */
const tipoItemSeed: FluxodocsTipoItem[] = [
  { id: 1, nome: "Conta", codigo: "CONTA", descricao: "Conta de faturamento", ordem: 1, ...audit() },
  { id: 2, nome: "Atendimento", codigo: "ATENDIMENTO", descricao: "Atendimento clínico", ordem: 2, ...audit() },
  { id: 3, nome: "Paciente", codigo: "PACIENTE", descricao: "Vinculação por paciente (cliente)", ordem: 3, ...audit() },
  { id: 4, nome: "Documento", codigo: "DOCUMENTO", descricao: "Documento avulso", ordem: 4, ...audit() },
  { id: 5, nome: "Ofício", codigo: "OFICIO", descricao: "Ofício oficial", ordem: 5, ...audit() },
  { id: 6, nome: "Manual", codigo: "MANUAL", descricao: "Item incluído manualmente", ordem: 6, ...audit() },
  ...Array.from({ length: 16 }, (_, i) => ({
    id: 7 + i,
    nome: `Item Custom ${i + 1}`,
    codigo: `ITEM_${i + 1}`,
    descricao: "Item cadastrado para teste",
    ordem: 7 + i,
    ...audit(),
  })),
];

/* ─────────────── 7. Status do Item ─────────────── */
const statusItemSeed: FluxodocsStatusItem[] = [
  { id: 1, nome: "Pendente", codigo: "PENDENTE", ordem: 1, cor: "#f59e0b", finalizador: false, ...audit() },
  { id: 2, nome: "Aceito", codigo: "ACEITO", ordem: 2, cor: "#10b981", finalizador: true, ...audit() },
  { id: 3, nome: "Devolvido", codigo: "DEVOLVIDO", ordem: 3, cor: "#ef4444", finalizador: true, ...audit() },
  { id: 4, nome: "Em Análise", codigo: "ANALISE", ordem: 4, cor: "#3b82f6", finalizador: false, ...audit() },
  { id: 5, nome: "Cancelado", codigo: "CANCELADO", ordem: 5, cor: "#64748b", finalizador: true, ...audit() },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: 6 + i,
    nome: `Status Item ${i + 1}`,
    codigo: `STIT_${i + 1}`,
    ordem: 6 + i,
    cor: "#a3a3a3",
    finalizador: false,
    ...audit(),
  })),
];

/* ─────────────── 8. Setor ─────────────── */
const setoresBase = [
  ["Faturamento", "FAT"], ["Recepção", "REC"], ["Centro Cirúrgico", "CC"],
  ["UTI", "UTI"], ["Pronto Atendimento", "PA"], ["Enfermagem", "ENF"],
  ["Farmácia", "FARM"], ["Almoxarifado", "ALM"], ["Laboratório", "LAB"],
  ["Radiologia", "RX"], ["Auditoria", "AUD"], ["Financeiro", "FIN"],
  ["Jurídico", "JUR"], ["RH", "RH"], ["TI", "TI"], ["Diretoria", "DIR"],
  ["SAME", "SAME"], ["Nutrição", "NUTR"], ["Psicologia", "PSI"],
  ["Fisioterapia", "FISIO"], ["Compras", "COMP"], ["Manutenção", "MAN"],
];
const setorSeed: FluxodocsSetor[] = setoresBase.map(([nome, sigla], i) => ({
  id: i + 1,
  nome,
  sigla,
  cor: ["#3b82f6", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6", "#06b6d4"][i % 6],
  responsavelId: null,
  participaFluxo: true,
  ...audit(),
}));

/* ─────────────── 9. Tipo de Documento ─────────────── */
const tipoDocBase = [
  ["Conta de Faturamento", "FATURAMENTO"], ["Guia SADT", "FATURAMENTO"],
  ["Guia de Internação", "FATURAMENTO"], ["Prontuário", "PRONTUARIO"],
  ["Laudo Médico", "PRONTUARIO"], ["Receituário", "PRONTUARIO"],
  ["Atestado", "PRONTUARIO"], ["Termo de Consentimento", "PRONTUARIO"],
  ["Anamnese", "PRONTUARIO"], ["Relatório de Cirurgia", "PRONTUARIO"],
  ["Ofício", "ADMINISTRATIVO"], ["Memorando", "ADMINISTRATIVO"],
  ["Comunicado", "ADMINISTRATIVO"], ["Ata de Reunião", "ADMINISTRATIVO"],
  ["Contrato", "JURIDICO"], ["Aditivo", "JURIDICO"],
  ["Notificação", "JURIDICO"], ["Procuração", "JURIDICO"],
  ["Nota Fiscal", "FINANCEIRO"], ["Boleto", "FINANCEIRO"],
  ["Recibo", "FINANCEIRO"], ["Comprovante de Pagamento", "FINANCEIRO"],
];
const tipoDocSeed: FluxodocsTipoDocumento[] = tipoDocBase.map(([nome, cat], i) => ({
  id: i + 1,
  nome,
  categoria: cat,
  cor: ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b", "#ef4444", "#06b6d4"][i % 6],
  ...audit(),
}));

/* ─────────────── 10. Motivo ─────────────── */
const motivosBase: Array<[string, string]> = [
  ["Documento ilegível", "DEVOLUCAO"], ["Falta assinatura", "DEVOLUCAO"],
  ["Dados incompletos", "DEVOLUCAO"], ["CID inválido", "DEVOLUCAO"],
  ["Falta carimbo", "DEVOLUCAO"], ["Procedimento não autorizado", "DEVOLUCAO"],
  ["Envio Inicial", "ENVIO"], ["Reenvio Programado", "REENVIO"],
  ["Cancelamento Solicitado", "CANCELAMENTO"], ["Erro de digitação", "CANCELAMENTO"],
  ["Documento Duplicado", "CANCELAMENTO"], ["Solicitação do paciente", "CANCELAMENTO"],
  ["Justificativa Médica", "JUSTIFICATIVA"], ["Justificativa Administrativa", "JUSTIFICATIVA"],
  ["Documento entregue fisicamente", "JUSTIFICATIVA"],
  ["Paciente sem condições", "JUSTIFICATIVA"], ["Reenvio após correção", "REENVIO"],
  ["Reenvio por solicitação", "REENVIO"], ["Envio em remessa", "ENVIO"],
  ["Envio prioritário", "ENVIO"], ["Envio para auditoria", "ENVIO"],
  ["Devolução por glosa", "DEVOLUCAO"],
];
const motivoSeed: FluxodocsMotivo[] = motivosBase.map(([nome, tipo], i) => ({
  id: i + 1, nome, tipo, ...audit(),
}));

/* ─────────────── 11. Regra de Fluxo ─────────────── */
const regraFluxoSeed: FluxodocsRegraFluxo[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  setorOrigemId: ((i % setorSeed.length) + 1),
  setorDestinoId: (((i + 3) % setorSeed.length) + 1),
  tipoDocumentoId: ((i % tipoDocSeed.length) + 1),
  tipoMovimentacaoId: ((i % 6) + 1),
  ...audit(),
}));

/* ─────────────── 12. Parâmetro SLA ─────────────── */
const slaSeed: FluxodocsParametroSla[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  tipoDocumentoId: ((i % tipoDocSeed.length) + 1),
  setorDestinoId: i % 3 === 0 ? null : ((i % setorSeed.length) + 1),
  prioridadeId: ((i % 3) + 1),
  convenioId: i % 4 === 0 ? null : ((i % 8) + 1),
  prazoHoras: [4, 8, 12, 24, 48, 72][i % 6],
  ...audit(),
}));

/* ─────────────── 13. Parâmetro IA ─────────────── */
const iaSeed: FluxodocsParametroIa[] = [
  { id: 1, nome: "Peso da Prioridade", chave: "peso_prioridade", valor: "0.30", ...audit() },
  { id: 2, nome: "Peso do SLA", chave: "peso_sla", valor: "0.25", ...audit() },
  { id: 3, nome: "Peso do Risco de Atraso", chave: "peso_risco_atraso", valor: "0.15", ...audit() },
  { id: 4, nome: "Peso de Glosa", chave: "peso_glosa", valor: "0.10", ...audit() },
  { id: 5, nome: "Peso de Complexidade", chave: "peso_complexidade", valor: "0.10", ...audit() },
  { id: 6, nome: "Peso do Convênio", chave: "peso_convenio", valor: "0.10", ...audit() },
  { id: 7, nome: "Limite de alerta SLA (%)", chave: "limite_alerta_sla", valor: "70", ...audit() },
  { id: 8, nome: "Limite de risco alto", chave: "limite_risco_alto", valor: "0.75", ...audit() },
  ...Array.from({ length: 14 }, (_, i) => ({
    id: 9 + i,
    nome: `Parâmetro IA ${i + 1}`,
    chave: `param_ia_${i + 1}`,
    valor: String(0.1 + i * 0.05),
    ...audit(),
  })),
];

/* ─────────────── 14. Workflow por Tipo de Documento ─────────────── */
const workflowTipoDocSeed: FluxodocsWorkflowTipoDocumento[] = tipoDocSeed.slice(0, 22).map((td, i) => ({
  id: i + 1,
  tipoDocumentoId: td.id,
  nome: `Workflow ${td.nome}`,
  descricao: `Fluxo padrão para ${td.nome.toLowerCase()}`,
  ...audit(),
}));

/* ─────────────── 15. Workflow Etapa ─────────────── */
const workflowEtapaSeed: FluxodocsWorkflowEtapa[] = Array.from({ length: 28 }, (_, i) => ({
  id: i + 1,
  workflowId: ((i % workflowTipoDocSeed.length) + 1),
  statusOrigemId: ((i % statusSeed.length) + 1),
  statusDestinoId: (((i + 1) % statusSeed.length) + 1),
  acao: ["ENVIAR", "RECEBER", "DEVOLVER", "REENVIAR", "FINALIZAR", "CANCELAR"][i % 6],
  ordem: i + 1,
  exigeMotivo: i % 3 === 0,
  exigeObservacao: i % 4 === 0,
  permiteReversao: i % 5 === 0,
  perfilPermitido: ["ADMIN", "OPERADOR", "AUDITOR", "GESTOR"][i % 4],
  ...audit(),
}));

/* ─────────────── 16. Documentação por Convênio ─────────────── */
const docConvenioSeed: FluxodocsDocObrigatorioConvenio[] = Array.from({ length: 24 }, (_, i) => ({
  id: i + 1,
  convenioId: ((i % 8) + 1),
  tipoDocumentoId: ((i % tipoDocSeed.length) + 1),
  tipoMovimentacaoId: i % 3 === 0 ? null : ((i % 6) + 1),
  prioridadeId: i % 4 === 0 ? null : ((i % 3) + 1),
  obrigatorio: true,
  bloqueiaEnvio: i % 2 === 0,
  exigeJustificativaAusencia: i % 3 === 0,
  exigeAprovacaoJustificativa: i % 5 === 0,
  descricao: `Regra de documentação ${i + 1}`,
  ...audit(),
}));

/* ─────────────── Exportação dos CRUDs ─────────────── */
export const tiposMovimentacaoSvc = createCrud<FluxodocsTipoMovimentacao>(
  "/fluxodocs/tipos-movimentacao",
  tipoMovimentacaoSeed,
);
export const prioridadesSvc = createCrud<FluxodocsPrioridade>(
  "/fluxodocs/prioridades",
  prioridadeSeed,
);
export const statusSvc = createCrud<FluxodocsStatus>(
  "/fluxodocs/status",
  statusSeed,
);
export const tiposItemSvc = createCrud<FluxodocsTipoItem>(
  "/fluxodocs/tipos-item",
  tipoItemSeed,
);
export const statusItemSvc = createCrud<FluxodocsStatusItem>(
  "/fluxodocs/status-item",
  statusItemSeed,
);
export const setoresSvc = createCrud<FluxodocsSetor>(
  "/fluxodocs/setores",
  setorSeed,
);
export const tiposDocumentoSvc = createCrud<FluxodocsTipoDocumento>(
  "/fluxodocs/tipos-documento",
  tipoDocSeed,
);
export const motivosSvc = createCrud<FluxodocsMotivo>(
  "/fluxodocs/motivos",
  motivoSeed,
);
export const regrasFluxoSvc = createCrud<FluxodocsRegraFluxo>(
  "/fluxodocs/regras-fluxo",
  regraFluxoSeed,
);
export const slaSvc = createCrud<FluxodocsParametroSla>(
  "/fluxodocs/parametros-sla",
  slaSeed,
);
export const iaSvc = createCrud<FluxodocsParametroIa>(
  "/fluxodocs/parametros-ia",
  iaSeed,
);
export const workflowTipoDocSvc = createCrud<FluxodocsWorkflowTipoDocumento>(
  "/fluxodocs/workflow-tipo-documento",
  workflowTipoDocSeed,
);
export const workflowEtapaSvc = createCrud<FluxodocsWorkflowEtapa>(
  "/fluxodocs/workflow-etapas",
  workflowEtapaSeed,
);
export const docConvenioSvc = createCrud<FluxodocsDocObrigatorioConvenio>(
  "/fluxodocs/documentacao-convenio",
  docConvenioSeed,
);
