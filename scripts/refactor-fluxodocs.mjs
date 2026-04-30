/**
 * Gera, para cada uma das 19 entidades fluxodocs_*:
 *  - src/services/fluxodocs<Entidade>.ts        (service explícito + mock store próprio)
 *  - src/pages/Fluxodocs<Entidade>/index.tsx    (listagem própria)
 *  - .../components/Fluxodocs<Entidade>Form.tsx
 *  - .../components/Fluxodocs<Entidade>Modal.tsx
 *
 * Depois remove os arquivos do engine genérico:
 *  - src/lib/fluxodocs/
 *  - src/services/fluxodocs.ts
 */
import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

// ---------------------------------------------------------------------------
// Catálogo das 19 entidades.
// fields: [{ name, label, type, required?, options?, isFk?, group? }]
//   type: text | textarea | number | boolean | color | select | datetime
// search: nomes de campos para busca livre
// list:   colunas a exibir (além de id e situação)
// ---------------------------------------------------------------------------

const TIPO_MOV_OPTS = `[{id:1,value:"ENVIO"},{id:2,value:"REMESSA"},{id:3,value:"DEVOLUCAO"},{id:4,value:"REENVIO"},{id:5,value:"INTERNO"},{id:6,value:"RECEBIMENTO_MANUAL"}]`;
const PRIORIDADE_OPTS = `[{id:1,value:"Normal"},{id:2,value:"Alta"},{id:3,value:"Urgente"}]`;
const STATUS_OPTS = `[{id:1,value:"Aberto"},{id:2,value:"Enviado"},{id:3,value:"Recebido"},{id:4,value:"Devolvido"},{id:5,value:"Aceito Parcial"},{id:6,value:"Reenviado"},{id:7,value:"Cancelado"},{id:8,value:"Finalizado"}]`;
const STATUS_ITEM_OPTS = `[{id:1,value:"Pendente"},{id:2,value:"Aceito"},{id:3,value:"Devolvido"}]`;
const SETOR_OPTS = `[{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}]`;
const TIPO_DOC_OPTS = `[{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}]`;
const TIPO_ITEM_OPTS = `[{id:1,value:"CONTA"},{id:2,value:"ATENDIMENTO"},{id:3,value:"PACIENTE"},{id:4,value:"DOCUMENTO"},{id:5,value:"OFICIO"},{id:6,value:"MANUAL"}]`;
const MOTIVO_OPTS = `[{id:1,value:"Envio para auditoria"},{id:2,value:"Documento ilegível"},{id:3,value:"Falta de assinatura"},{id:4,value:"Falta carteirinha"},{id:5,value:"CID inconsistente"},{id:6,value:"Procedimento divergente"}]`;
const WORKFLOW_OPTS = `[{id:1,value:"Workflow 1"},{id:2,value:"Workflow 2"},{id:3,value:"Workflow 3"},{id:4,value:"Workflow 4"},{id:5,value:"Workflow 5"}]`;
const CONVENIO_OPTS = `[{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}]`;
const USUARIO_OPTS = `[{id:1,value:"Dr. João Silva"},{id:2,value:"Maria Souza"},{id:3,value:"Carlos Lima"},{id:4,value:"Ana Beatriz"}]`;
const PACIENTE_OPTS = `Array.from({length:15},(_,i)=>({id:i+1,value:\`Paciente \${String(i+1).padStart(3,"0")}\`}))`;
const CONTA_OPTS = `Array.from({length:10},(_,i)=>({id:i+1,value:\`Conta \${20260000+i}\`}))`;
const ATEND_OPTS = `Array.from({length:10},(_,i)=>({id:i+1,value:\`Atendimento \${10000+i}\`}))`;
const PROTOCOLO_OPTS = `Array.from({length:8},(_,i)=>({id:i+1,value:\`Protocolo \${i+1}\`}))`;
const CHECKLIST_OPTS = `Array.from({length:22},(_,i)=>({id:i+1,value:\`Checklist #\${i+1}\`}))`;
const ITEM_OPTS = `Array.from({length:8},(_,i)=>({id:i+1,value:\`Item \${i+1}\`}))`;

const TIPO_FIELD_OPTS = {
  motivo: `[{id:"ENVIO",value:"Envio"},{id:"DEVOLUCAO",value:"Devolução"},{id:"CANCELAMENTO",value:"Cancelamento"},{id:"REENVIO",value:"Reenvio"},{id:"JUSTIFICATIVA",value:"Justificativa"}]`,
  tipoDocCategoria: `[{id:"FATURAMENTO",value:"Faturamento"},{id:"CLINICO",value:"Clínico"},{id:"ADMINISTRATIVO",value:"Administrativo"}]`,
  status: `[{id:"INICIAL",value:"Inicial"},{id:"FLUXO",value:"Fluxo"},{id:"EXCECAO",value:"Exceção"},{id:"FINAL",value:"Final"}]`,
  acao: `[{id:"ENVIAR",value:"Enviar"},{id:"RECEBER",value:"Receber"},{id:"DEVOLVER",value:"Devolver"},{id:"REENVIAR",value:"Reenviar"},{id:"ACEITAR",value:"Aceitar"},{id:"CANCELAR",value:"Cancelar"}]`,
  perfil: `[{id:"TODOS",value:"Todos"},{id:"AUDITOR",value:"Auditor"},{id:"FATURISTA",value:"Faturista"},{id:"GESTOR",value:"Gestor"}]`,
  slaStatus: `[{id:"NO_PRAZO",value:"No prazo"},{id:"ATRASADO",value:"Atrasado"},{id:"EM_RISCO",value:"Em risco"}]`,
  statusChecklist: `[{id:"PENDENTE",value:"Pendente"},{id:"ANEXADO",value:"Anexado"},{id:"CONFIRMADO",value:"Confirmado"},{id:"JUSTIFICADO",value:"Justificado"},{id:"BLOQUEANTE",value:"Bloqueante"}]`,
  statusAprovacao: `[{id:"PENDENTE",value:"Pendente"},{id:"APROVADO",value:"Aprovado"},{id:"REPROVADO",value:"Reprovado"},{id:"CANCELADO",value:"Cancelado"}]`,
  acaoLog: `[{id:"CRIADO",value:"Criado"},{id:"ENVIADO",value:"Enviado"},{id:"RECEBIDO",value:"Recebido"},{id:"DEVOLVIDO",value:"Devolvido"},{id:"REENVIADO",value:"Reenviado"},{id:"CANCELADO",value:"Cancelado"},{id:"DOCUMENTO_ANEXADO",value:"Documento anexado"}]`,
};

const ENTITIES = [
  {
    key: "TiposMovimentacao",
    type: "FluxodocsTipoMovimentacao",
    folder: "FluxodocsTiposMovimentacao",
    serviceFile: "fluxodocsTiposMovimentacao",
    title: { sing: "Tipo de Movimentação", plur: "Tipos de Movimentação" },
    endpoint: "/fluxodocs/tipos-movimentacao",
    seedFn: "seedTiposMovimentacao",
    list: ["codigo", "nome", "ordem"],
    search: ["nome", "codigo"],
    fields: [
      { name: "codigo", label: "Código", type: "text", required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "textarea" },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
    ],
  },
  {
    key: "Prioridades",
    type: "FluxodocsPrioridade",
    folder: "FluxodocsPrioridades",
    serviceFile: "fluxodocsPrioridades",
    title: { sing: "Prioridade", plur: "Prioridades" },
    endpoint: "/fluxodocs/prioridades",
    seedFn: "seedPrioridades",
    list: ["codigo", "nome", "peso", "cor", "ordem"],
    search: ["nome", "codigo"],
    fields: [
      { name: "codigo", label: "Código", type: "text", required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "peso", label: "Peso", type: "number", required: true, defaultValue: 1 },
      { name: "cor", label: "Cor", type: "color", defaultValue: "#3b82f6" },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
    ],
  },
  {
    key: "Status",
    type: "FluxodocsStatus",
    folder: "FluxodocsStatus",
    serviceFile: "fluxodocsStatus",
    title: { sing: "Status", plur: "Status do Fluxo" },
    endpoint: "/fluxodocs/status",
    seedFn: "seedStatus",
    list: ["codigo", "nome", "tipo", "cor", "ordem"],
    search: ["nome", "codigo"],
    fields: [
      { name: "codigo", label: "Código", type: "text", required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "tipo", label: "Tipo", type: "select", options: TIPO_FIELD_OPTS.status, required: true },
      { name: "cor", label: "Cor", type: "color", defaultValue: "#3b82f6" },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
      { name: "permiteEdicao", label: "Permite Edição", type: "boolean", defaultValue: true },
      { name: "finalizador", label: "Finalizador", type: "boolean", defaultValue: false },
    ],
  },
  {
    key: "TiposItem",
    type: "FluxodocsTipoItem",
    folder: "FluxodocsTiposItem",
    serviceFile: "fluxodocsTiposItem",
    title: { sing: "Tipo de Item", plur: "Tipos de Item" },
    endpoint: "/fluxodocs/tipos-item",
    seedFn: "seedTiposItem",
    list: ["codigo", "nome", "ordem"],
    search: ["nome", "codigo"],
    fields: [
      { name: "codigo", label: "Código", type: "text", required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "textarea" },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
    ],
  },
  {
    key: "StatusItem",
    type: "FluxodocsStatusItem",
    folder: "FluxodocsStatusItem",
    serviceFile: "fluxodocsStatusItem",
    title: { sing: "Status do Item", plur: "Status do Item" },
    endpoint: "/fluxodocs/status-item",
    seedFn: "seedStatusItem",
    list: ["codigo", "nome", "ordem", "cor"],
    search: ["nome", "codigo"],
    fields: [
      { name: "codigo", label: "Código", type: "text", required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
      { name: "cor", label: "Cor", type: "color", defaultValue: "#3b82f6" },
      { name: "finalizador", label: "Finalizador", type: "boolean", defaultValue: false },
    ],
  },
  {
    key: "Setores",
    type: "FluxodocsSetor",
    folder: "FluxodocsSetores",
    serviceFile: "fluxodocsSetores",
    title: { sing: "Setor", plur: "Setores" },
    endpoint: "/fluxodocs/setores",
    seedFn: "seedSetores",
    list: ["nome", "sigla", "cor"],
    search: ["nome", "sigla"],
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "sigla", label: "Sigla", type: "text", required: true },
      { name: "cor", label: "Cor", type: "color", defaultValue: "#3b82f6" },
      { name: "responsavelId", label: "Responsável", type: "select", options: USUARIO_OPTS },
      { name: "participaFluxo", label: "Participa do fluxo", type: "boolean", defaultValue: true },
    ],
  },
  {
    key: "TiposDocumento",
    type: "FluxodocsTipoDocumento",
    folder: "FluxodocsTiposDocumento",
    serviceFile: "fluxodocsTiposDocumento",
    title: { sing: "Tipo de Documento", plur: "Tipos de Documento" },
    endpoint: "/fluxodocs/tipos-documento",
    seedFn: "seedTiposDocumento",
    list: ["nome", "categoria", "cor"],
    search: ["nome", "categoria"],
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "categoria", label: "Categoria", type: "select", options: TIPO_FIELD_OPTS.tipoDocCategoria, required: true },
      { name: "cor", label: "Cor", type: "color", defaultValue: "#3b82f6" },
    ],
  },
  {
    key: "Motivos",
    type: "FluxodocsMotivo",
    folder: "FluxodocsMotivos",
    serviceFile: "fluxodocsMotivos",
    title: { sing: "Motivo", plur: "Motivos" },
    endpoint: "/fluxodocs/motivos",
    seedFn: "seedMotivos",
    list: ["nome", "tipo"],
    search: ["nome"],
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "tipo", label: "Tipo", type: "select", options: TIPO_FIELD_OPTS.motivo, required: true },
    ],
  },
  {
    key: "RegrasFluxo",
    type: "FluxodocsRegraFluxo",
    folder: "FluxodocsRegrasFluxo",
    serviceFile: "fluxodocsRegrasFluxo",
    title: { sing: "Regra de Fluxo", plur: "Regras de Fluxo" },
    endpoint: "/fluxodocs/regras-fluxo",
    seedFn: "seedRegrasFluxo",
    list: ["setorOrigemId", "setorDestinoId", "tipoDocumentoId", "tipoMovimentacaoId"],
    search: [],
    fields: [
      { name: "setorOrigemId", label: "Setor de Origem", type: "select", options: SETOR_OPTS, required: true },
      { name: "setorDestinoId", label: "Setor de Destino", type: "select", options: SETOR_OPTS, required: true },
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS, required: true },
      { name: "tipoMovimentacaoId", label: "Tipo de Movimentação", type: "select", options: TIPO_MOV_OPTS, required: true },
    ],
  },
  {
    key: "ParametrosSla",
    type: "FluxodocsParametroSla",
    folder: "FluxodocsParametrosSla",
    serviceFile: "fluxodocsParametrosSla",
    title: { sing: "Parâmetro de SLA", plur: "Parâmetros de SLA" },
    endpoint: "/fluxodocs/parametros-sla",
    seedFn: "seedParametrosSla",
    list: ["tipoDocumentoId", "setorDestinoId", "prioridadeId", "convenioId", "prazoHoras"],
    search: [],
    fields: [
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS, required: true },
      { name: "setorDestinoId", label: "Setor de Destino", type: "select", options: SETOR_OPTS },
      { name: "prioridadeId", label: "Prioridade", type: "select", options: PRIORIDADE_OPTS, required: true },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTS },
      { name: "prazoHoras", label: "Prazo (horas)", type: "number", required: true, defaultValue: 24 },
    ],
  },
  {
    key: "ParametrosIa",
    type: "FluxodocsParametroIa",
    folder: "FluxodocsParametrosIa",
    serviceFile: "fluxodocsParametrosIa",
    title: { sing: "Parâmetro de IA", plur: "Parâmetros de IA" },
    endpoint: "/fluxodocs/parametros-ia",
    seedFn: "seedParametrosIa",
    list: ["nome", "chave", "valor"],
    search: ["nome", "chave"],
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "chave", label: "Chave", type: "text", required: true },
      { name: "valor", label: "Valor", type: "text", required: true },
    ],
  },
  {
    key: "WorkflowTiposDocumento",
    type: "FluxodocsWorkflowTipoDocumento",
    folder: "FluxodocsWorkflowTiposDocumento",
    serviceFile: "fluxodocsWorkflowTiposDocumento",
    title: { sing: "Workflow", plur: "Workflows por Tipo de Documento" },
    endpoint: "/fluxodocs/workflows",
    seedFn: "seedWorkflows",
    list: ["nome", "tipoDocumentoId"],
    search: ["nome"],
    fields: [
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS, required: true },
      { name: "descricao", label: "Descrição", type: "textarea" },
    ],
  },
  {
    key: "WorkflowEtapas",
    type: "FluxodocsWorkflowEtapa",
    folder: "FluxodocsWorkflowEtapas",
    serviceFile: "fluxodocsWorkflowEtapas",
    title: { sing: "Etapa de Workflow", plur: "Etapas do Workflow" },
    endpoint: "/fluxodocs/workflow-etapas",
    seedFn: "seedWorkflowEtapas",
    list: ["workflowId", "acao", "statusOrigemId", "statusDestinoId", "ordem"],
    search: ["acao"],
    fields: [
      { name: "workflowId", label: "Workflow", type: "select", options: WORKFLOW_OPTS, required: true },
      { name: "statusOrigemId", label: "Status de Origem", type: "select", options: STATUS_OPTS, required: true },
      { name: "statusDestinoId", label: "Status de Destino", type: "select", options: STATUS_OPTS, required: true },
      { name: "acao", label: "Ação", type: "select", options: TIPO_FIELD_OPTS.acao, required: true },
      { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
      { name: "exigeMotivo", label: "Exige motivo", type: "boolean", defaultValue: false },
      { name: "exigeObservacao", label: "Exige observação", type: "boolean", defaultValue: false },
      { name: "permiteReversao", label: "Permite reversão", type: "boolean", defaultValue: false },
      { name: "perfilPermitido", label: "Perfil permitido", type: "select", options: TIPO_FIELD_OPTS.perfil, required: true, defaultValue: '"TODOS"' },
    ],
  },
  {
    key: "DocumentosObrigatoriosConvenio",
    type: "FluxodocsDocumentoObrigatorioConvenio",
    folder: "FluxodocsDocumentosObrigatoriosConvenio",
    serviceFile: "fluxodocsDocumentosObrigatoriosConvenio",
    title: { sing: "Documento Obrigatório por Convênio", plur: "Documentos Obrigatórios por Convênio" },
    endpoint: "/fluxodocs/documentos-obrigatorios-convenio",
    seedFn: "seedDocumentosObrigatoriosConvenio",
    list: ["convenioId", "tipoDocumentoId", "obrigatorio", "bloqueiaEnvio"],
    search: ["descricao"],
    fields: [
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTS, required: true },
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS, required: true },
      { name: "tipoMovimentacaoId", label: "Tipo de Movimentação", type: "select", options: TIPO_MOV_OPTS },
      { name: "prioridadeId", label: "Prioridade", type: "select", options: PRIORIDADE_OPTS },
      { name: "obrigatorio", label: "Obrigatório", type: "boolean", defaultValue: true },
      { name: "bloqueiaEnvio", label: "Bloqueia envio", type: "boolean", defaultValue: false },
      { name: "exigeJustificativaAusencia", label: "Exige justificativa de ausência", type: "boolean", defaultValue: false },
      { name: "exigeAprovacaoJustificativa", label: "Exige aprovação da justificativa", type: "boolean", defaultValue: false },
      { name: "descricao", label: "Descrição", type: "textarea" },
    ],
  },
  {
    key: "ChecklistDocumental",
    type: "FluxodocsChecklistDocumental",
    folder: "FluxodocsChecklistDocumental",
    serviceFile: "fluxodocsChecklistDocumental",
    title: { sing: "Checklist Documental", plur: "Checklist Documental" },
    endpoint: "/fluxodocs/checklist",
    seedFn: "seedChecklist",
    list: ["protocoloId", "tipoDocumentoId", "convenioId", "statusChecklist"],
    search: [],
    fields: [
      { name: "protocoloId", label: "Protocolo", type: "select", options: PROTOCOLO_OPTS, required: true },
      { name: "itemId", label: "Item", type: "select", options: ITEM_OPTS },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTS },
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS, required: true },
      { name: "documentoObrigatorioId", label: "Documento Obrigatório", type: "number" },
      { name: "statusChecklist", label: "Status do Checklist", type: "select", options: TIPO_FIELD_OPTS.statusChecklist, required: true, defaultValue: '"PENDENTE"' },
      { name: "documentoAnexadoId", label: "Documento Anexado (ID)", type: "number" },
      { name: "justificativaAusencia", label: "Justificativa de Ausência", type: "textarea" },
      { name: "iaSugestao", label: "IA — Sugestão", type: "textarea" },
      { name: "iaRiscoGlosa", label: "IA — Risco de Glosa", type: "number" },
    ],
  },
  {
    key: "AprovacoesJustificativa",
    type: "FluxodocsAprovacaoJustificativa",
    folder: "FluxodocsAprovacoesJustificativa",
    serviceFile: "fluxodocsAprovacoesJustificativa",
    title: { sing: "Aprovação de Justificativa", plur: "Aprovações de Justificativa" },
    endpoint: "/fluxodocs/aprovacoes",
    seedFn: "seedAprovacoes",
    list: ["protocoloId", "checklistId", "statusAprovacao"],
    search: ["justificativa"],
    fields: [
      { name: "checklistId", label: "Checklist", type: "select", options: CHECKLIST_OPTS, required: true },
      { name: "protocoloId", label: "Protocolo", type: "select", options: PROTOCOLO_OPTS, required: true },
      { name: "itemId", label: "Item", type: "select", options: ITEM_OPTS },
      { name: "justificativa", label: "Justificativa", type: "textarea", required: true },
      { name: "statusAprovacao", label: "Status da Aprovação", type: "select", options: TIPO_FIELD_OPTS.statusAprovacao, required: true, defaultValue: '"PENDENTE"' },
      { name: "solicitadoPorId", label: "Solicitado por", type: "select", options: USUARIO_OPTS, required: true },
      { name: "solicitadoEm", label: "Solicitado em", type: "datetime", required: true },
      { name: "aprovadoPorId", label: "Aprovado por", type: "select", options: USUARIO_OPTS },
      { name: "aprovadoEm", label: "Aprovado em", type: "datetime" },
      { name: "observacaoAprovador", label: "Observação do aprovador", type: "textarea" },
    ],
  },
  {
    key: "Protocolos",
    type: "FluxodocsProtocolo",
    folder: "FluxodocsProtocolos",
    serviceFile: "fluxodocsProtocolos",
    title: { sing: "Protocolo", plur: "Protocolos" },
    endpoint: "/fluxodocs/protocolos",
    seedFn: "seedProtocolos",
    list: ["numero", "statusId", "prioridadeId", "setorOrigemId", "setorDestinoId"],
    search: ["numero"],
    fields: [
      { name: "numero", label: "Número", type: "text", required: true },
      { name: "tipoMovimentacaoId", label: "Tipo de Movimentação", type: "select", options: TIPO_MOV_OPTS, required: true },
      { name: "setorOrigemId", label: "Setor de Origem", type: "select", options: SETOR_OPTS, required: true },
      { name: "setorDestinoId", label: "Setor de Destino", type: "select", options: SETOR_OPTS, required: true },
      { name: "prioridadeId", label: "Prioridade", type: "select", options: PRIORIDADE_OPTS, required: true },
      { name: "motivoId", label: "Motivo", type: "select", options: MOTIVO_OPTS },
      { name: "statusId", label: "Status", type: "select", options: STATUS_OPTS, required: true },
      { name: "observacao", label: "Observação", type: "textarea" },
      { name: "slaPrevistoEm", label: "SLA Previsto em", type: "datetime" },
      { name: "slaRealizadoEm", label: "SLA Realizado em", type: "datetime" },
      { name: "slaStatus", label: "Status do SLA", type: "select", options: TIPO_FIELD_OPTS.slaStatus },
      { name: "iaRiscoAtraso", label: "IA — Risco de Atraso", type: "number" },
      { name: "iaScoreComplexidade", label: "IA — Score Complexidade", type: "number" },
      { name: "iaScorePrioridade", label: "IA — Score Prioridade", type: "number" },
      { name: "iaRecomendacao", label: "IA — Recomendação", type: "textarea" },
      { name: "ordemFila", label: "Ordem na Fila", type: "number" },
      { name: "protocoloOrigemId", label: "Protocolo de Origem (ID)", type: "number" },
    ],
  },
  {
    key: "ProtocoloItens",
    type: "FluxodocsProtocoloItem",
    folder: "FluxodocsProtocoloItens",
    serviceFile: "fluxodocsProtocoloItens",
    title: { sing: "Item de Protocolo", plur: "Itens de Protocolo" },
    endpoint: "/fluxodocs/protocolo-itens",
    seedFn: "seedProtocoloItens",
    list: ["protocoloId", "tipoItemId", "tipoDocumentoId", "statusItemId"],
    search: ["descricaoManual"],
    fields: [
      { name: "protocoloId", label: "Protocolo", type: "select", options: PROTOCOLO_OPTS, required: true },
      { name: "tipoItemId", label: "Tipo de Item", type: "select", options: TIPO_ITEM_OPTS, required: true },
      { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", options: TIPO_DOC_OPTS },
      { name: "contaId", label: "Conta", type: "select", options: CONTA_OPTS },
      { name: "atendimentoId", label: "Atendimento", type: "select", options: ATEND_OPTS },
      { name: "clienteId", label: "Paciente", type: "select", options: PACIENTE_OPTS },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTS },
      { name: "descricaoManual", label: "Descrição Manual", type: "textarea" },
      { name: "statusItemId", label: "Status do Item", type: "select", options: STATUS_ITEM_OPTS, required: true },
      { name: "motivoDevolucaoId", label: "Motivo de Devolução", type: "select", options: MOTIVO_OPTS },
      { name: "observacao", label: "Observação", type: "textarea" },
      { name: "iaProbabilidadeGlosa", label: "IA — Probabilidade de Glosa", type: "number" },
      { name: "iaSugestaoDevolucao", label: "IA — Sugestão de Devolução", type: "textarea" },
    ],
  },
  {
    key: "Logs",
    type: "FluxodocsLog",
    folder: "FluxodocsLogs",
    serviceFile: "fluxodocsLogs",
    title: { sing: "Log", plur: "Logs" },
    endpoint: "/fluxodocs/logs",
    seedFn: "seedLogs",
    list: ["protocoloId", "acao", "usuarioId", "setorId"],
    search: ["acao"],
    fields: [
      { name: "protocoloId", label: "Protocolo", type: "select", options: PROTOCOLO_OPTS },
      { name: "usuarioId", label: "Usuário", type: "select", options: USUARIO_OPTS },
      { name: "setorId", label: "Setor", type: "select", options: SETOR_OPTS },
      { name: "acao", label: "Ação", type: "select", options: TIPO_FIELD_OPTS.acaoLog, required: true },
      { name: "payload", label: "Payload", type: "textarea" },
    ],
  },
];

if (ENTITIES.length !== 19) {
  throw new Error(`Esperado 19 entidades, encontrado ${ENTITIES.length}`);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fieldDefaultLiteral(f) {
  if (f.defaultValue !== undefined) {
    return typeof f.defaultValue === "string" ? f.defaultValue : String(f.defaultValue);
  }
  if (f.type === "boolean") return "false";
  if (f.type === "number") return "null";
  if (f.type === "color") return '""';
  if (f.type === "select") return "null";
  return '""';
}

function fieldZodType(f) {
  if (f.type === "boolean") return "boolean";
  if (f.type === "number") return "number";
  return "string";
}

// Generates a TS type literal for the field value used in the form
function fieldTsType(f) {
  if (f.type === "boolean") return "boolean";
  if (f.type === "number") return "number | null";
  if (f.type === "select") {
    // numeric ids vs string options
    return f.options && /id:"/.test(f.options) ? "string | null" : "number | null";
  }
  return "string";
}

function fieldFormType(f) {
  // Same as TS type, but used for FormValues
  return fieldTsType(f);
}

// ---------------------------------------------------------------------------
// Templates
// ---------------------------------------------------------------------------

function serviceTemplate(e) {
  return `import api from "@/lib/axios";
import type { ApiSuccessResponse } from "@/types/api";
import type { ${e.type} } from "@/types/entities/Fluxodocs";
import { ${e.seedFn} } from "@/lib/fluxodocsMocks";

const ENDPOINT = "${e.endpoint}";
const MOCK_USER_ID = 1;

let mockStore: ${e.type}[] = ${e.seedFn}();
let nextId = (mockStore.reduce((m, r) => Math.max(m, r.id), 0) || 0) + 1;
const nowISO = () => new Date().toISOString();

async function tryApi<T>(fn: () => Promise<T>, fallback: () => T): Promise<T> {
  try { return await fn(); } catch { return fallback(); }
}

export type Create${e.type}DTO = Omit<${e.type}, "id" | "situacaoId" | "userCreatedId" | "created" | "userModifiedId" | "modified">;
export type Update${e.type}DTO = Partial<Create${e.type}DTO>;

export async function fetch${e.key}() {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<${e.type}[]>>(ENDPOINT);
      return res.data.data;
    },
    () => [...mockStore],
  );
}

export async function fetch${e.key.replace(/s$/, "") /* singular best-effort */}(id: number) {
  return tryApi(
    async () => {
      const res = await api.get<ApiSuccessResponse<${e.type}>>(\`\${ENDPOINT}/\${id}\`);
      return res.data.data;
    },
    () => mockStore.find((r) => r.id === id) ?? null,
  );
}

export async function create${e.key.replace(/s$/, "")}(data: Create${e.type}DTO) {
  return tryApi(
    async () => {
      const res = await api.post<ApiSuccessResponse<${e.type}>>(ENDPOINT, data);
      return res.data.data;
    },
    () => {
      const novo: ${e.type} = {
        ...(data as object),
        id: nextId++,
        situacaoId: 1,
        userCreatedId: MOCK_USER_ID,
        created: nowISO(),
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as ${e.type};
      mockStore = [novo, ...mockStore];
      return novo;
    },
  );
}

export async function update${e.key.replace(/s$/, "")}(id: number, data: Update${e.type}DTO) {
  return tryApi(
    async () => {
      const res = await api.put<ApiSuccessResponse<${e.type}>>(\`\${ENDPOINT}/\${id}\`, data);
      return res.data.data;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      const updated: ${e.type} = {
        ...mockStore[idx],
        ...data,
        userModifiedId: MOCK_USER_ID,
        modified: nowISO(),
      } as ${e.type};
      mockStore[idx] = updated;
      return updated;
    },
  );
}

export async function inactivate${e.key.replace(/s$/, "")}(id: number) {
  return tryApi(
    async () => {
      await api.patch(\`\${ENDPOINT}/\${id}/inactivate\`);
      return null;
    },
    () => {
      const idx = mockStore.findIndex((r) => r.id === id);
      if (idx === -1) throw new Error("Registro não encontrado");
      mockStore[idx] = { ...mockStore[idx], situacaoId: 2, modified: nowISO() };
      return null;
    },
  );
}
`;
}

function formTemplate(e) {
  // Build option arrays as constants
  const optionConsts = e.fields
    .filter((f) => f.type === "select" && f.options)
    .map((f) => `const OPTS_${f.name.toUpperCase()} = ${f.options} as const;`)
    .join("\n");

  // FormValues type
  const formValuesType = e.fields
    .map((f) => `  ${f.name}: ${fieldFormType(f)};`)
    .join("\n");

  // Default values
  const defaultValues = e.fields
    .map((f) => `    ${f.name}: ${fieldDefaultLiteral(f)},`)
    .join("\n");

  // Initial data spread (from entity → form values)
  const initialSpread = e.fields
    .map((f) => {
      if (f.type === "boolean") return `      ${f.name}: !!entity.${f.name},`;
      if (f.type === "number") return `      ${f.name}: entity.${f.name} ?? null,`;
      if (f.type === "select")
        return `      ${f.name}: entity.${f.name} ?? null,`;
      if (f.type === "datetime")
        return `      ${f.name}: entity.${f.name} ?? "",`;
      return `      ${f.name}: entity.${f.name} ?? "",`;
    })
    .join("\n");

  // Field renderers
  const renderField = (f) => {
    const errId = `errors.${f.name}`;
    const errClass = `\${${errId} ? " border-destructive" : ""}`;
    if (f.type === "textarea") {
      return `        <div className="space-y-1.5">
          <Label htmlFor="f-${f.name}">${f.label}${f.required ? " *" : ""}</Label>
          <Textarea
            id="f-${f.name}"
            value={values.${f.name} ?? ""}
            onChange={(e) => set("${f.name}", e.target.value)}
            disabled={readOnly}
            className={\`${errClass}\`}
          />
        </div>`;
    }
    if (f.type === "boolean") {
      return `        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-${f.name}" className="text-sm">${f.label}</Label>
          <Switch
            id="f-${f.name}"
            checked={!!values.${f.name}}
            onCheckedChange={(v) => set("${f.name}", v)}
            disabled={readOnly}
          />
        </div>`;
    }
    if (f.type === "color") {
      return `        <div className="space-y-1.5">
          <Label htmlFor="f-${f.name}">${f.label}${f.required ? " *" : ""}</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="f-${f.name}"
              value={values.${f.name} || "#3b82f6"}
              onChange={(e) => set("${f.name}", e.target.value)}
              disabled={readOnly}
              className="h-9 w-12 cursor-pointer rounded border"
            />
            <Input
              value={values.${f.name} ?? ""}
              onChange={(e) => set("${f.name}", e.target.value)}
              placeholder="#000000"
              disabled={readOnly}
              className={\`${errClass}\`}
            />
          </div>
        </div>`;
    }
    if (f.type === "select") {
      const isStringId = /id:"/.test(f.options || "");
      const onValChange = isStringId
        ? `(v) => set("${f.name}", v || null)`
        : `(v) => set("${f.name}", v ? Number(v) : null)`;
      return `        <div className="space-y-1.5">
          <Label htmlFor="f-${f.name}">${f.label}${f.required ? " *" : ""}</Label>
          <Select
            value={values.${f.name} != null ? String(values.${f.name}) : ""}
            onValueChange={${onValChange}}
            disabled={readOnly}
          >
            <SelectTrigger id="f-${f.name}" className={\`${errClass}\`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_${f.name.toUpperCase()}.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>`;
    }
    if (f.type === "datetime") {
      return `        <div className="space-y-1.5">
          <Label htmlFor="f-${f.name}">${f.label}${f.required ? " *" : ""}</Label>
          <Input
            id="f-${f.name}"
            type="datetime-local"
            value={values.${f.name} ? values.${f.name}.slice(0, 16) : ""}
            onChange={(e) => set("${f.name}", e.target.value ? new Date(e.target.value).toISOString() : "")}
            disabled={readOnly}
            className={\`${errClass}\`}
          />
        </div>`;
    }
    // text or number
    const inputType = f.type === "number" ? "number" : "text";
    const onChange =
      f.type === "number"
        ? `(e) => set("${f.name}", e.target.value === "" ? null : Number(e.target.value))`
        : `(e) => set("${f.name}", e.target.value)`;
    const value =
      f.type === "number"
        ? `values.${f.name} ?? ""`
        : `values.${f.name} ?? ""`;
    return `        <div className="space-y-1.5">
          <Label htmlFor="f-${f.name}">${f.label}${f.required ? " *" : ""}</Label>
          <Input
            id="f-${f.name}"
            type="${inputType}"
            value={${value}}
            onChange={${onChange}}
            disabled={readOnly}
            className={\`${errClass}\`}
          />
        </div>`;
  };

  const fieldsRender = e.fields.map(renderField).join("\n");

  // Validation: required fields → toast + set error
  const requiredChecks = e.fields
    .filter((f) => f.required)
    .map((f) => {
      const cond =
        f.type === "boolean"
          ? `false /* booleano sempre válido */`
          : f.type === "number"
            ? `values.${f.name} === null || values.${f.name} === undefined`
            : `!values.${f.name} && values.${f.name} !== 0`;
      return `    if (${cond}) {
      newErrors.${f.name} = true;
      firstError ??= "${f.label}";
    }`;
    })
    .join("\n");

  return `import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ${e.type} } from "@/types/entities/Fluxodocs";

${optionConsts}

export interface ${e.key.replace(/s$/, "")}FormValues {
${formValuesType}
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: ${e.type} | null;
  onSubmit: (values: ${e.key.replace(/s$/, "")}FormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: ${e.type} | null | undefined): ${e.key.replace(/s$/, "")}FormValues {
  if (!entity) {
    return {
${defaultValues}
    };
  }
  return {
${initialSpread}
  };
}

export function ${e.key.replace(/s$/, "")}Form({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<${e.key.replace(/s$/, "")}FormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ${e.key.replace(/s$/, "")}FormValues>(key: K, value: ${e.key.replace(/s$/, "")}FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
${requiredChecks}
    if (firstError) {
      setErrors(newErrors);
      toast.error(\`O campo \${firstError} é obrigatório\`);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
${fieldsRender}
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === "create" ? "Cadastrar" : "Salvar"}
          </Button>
        </div>
      )}
      {readOnly && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Fechar
          </Button>
        </div>
      )}
    </form>
  );
}
`;
}

function modalTemplate(e) {
  const sing = e.key.replace(/s$/, "");
  return `import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ${sing}Form, type ${sing}FormValues } from "./Fluxodocs${e.key}Form";
import type { ${e.type} } from "@/types/entities/Fluxodocs";
import { create${sing}, update${sing} } from "@/services/${e.serviceFile}";

export type Fluxodocs${e.key}ModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: Fluxodocs${e.key}ModalMode;
  registro?: ${e.type} | null;
  onSaved: () => void;
}

export function Fluxodocs${e.key}Modal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) ${e.title.sing}"
      : mode === "edit"
        ? "Editar ${e.title.sing}"
        : "Visualizar ${e.title.sing}";

  async function handleSubmit(values: ${sing}FormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await create${sing}(values as never);
        toast.success("${e.title.sing} cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await update${sing}(registro.id, values as never);
        toast.success("${e.title.sing} atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar ${e.title.sing.toLowerCase()}"
            : "Erro ao atualizar ${e.title.sing.toLowerCase()}",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <${sing}Form
        mode={mode === "edit" ? "edit" : "create"}
        readOnly={mode === "view"}
        initial={registro}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        submitting={submitting}
      />
    </FormModal>
  );
}
`;
}

function indexTemplate(e) {
  // Search filter clause
  const searchClause = e.search.length
    ? e.search.map((s) => `normalize(String(r.${s} ?? "")).includes(term)`).join(" || ")
    : `normalize(String(r.id)).includes(term)`;

  // List columns header + cell
  const listHeaders = e.list
    .map((c) => {
      const f = e.fields.find((x) => x.name === c);
      const label = f?.label ?? c;
      return `              <TableHead>${label}</TableHead>`;
    })
    .join("\n");

  const listCells = e.list
    .map((c) => {
      const f = e.fields.find((x) => x.name === c);
      if (!f) return `              <TableCell>{String((r as Record<string, unknown>).${c} ?? "—")}</TableCell>`;
      if (f.type === "color") {
        return `              <TableCell>
                {r.${c} ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 rounded border" style={{ background: String(r.${c}) }} />
                    <span className="text-xs text-muted-foreground">{String(r.${c})}</span>
                  </span>
                ) : "—"}
              </TableCell>`;
      }
      if (f.type === "boolean") {
        return `              <TableCell>{r.${c} ? "Sim" : "Não"}</TableCell>`;
      }
      if (f.type === "select" && f.options) {
        const constName = `OPTS_${c.toUpperCase()}`;
        return `              <TableCell>
                {(${constName}.find((o) => String(o.id) === String(r.${c}))?.value) ?? (r.${c} != null ? String(r.${c}) : "—")}
              </TableCell>`;
      }
      return `              <TableCell>{r.${c} != null && r.${c} !== "" ? String(r.${c}) : "—"}</TableCell>`;
    })
    .join("\n");

  // Option constants used in list rendering
  const optionConsts = e.list
    .map((c) => e.fields.find((x) => x.name === c))
    .filter((f) => f && f.type === "select" && f.options)
    .map((f) => `const OPTS_${f.name.toUpperCase()} = ${f.options} as const;`)
    .join("\n");

  const colspan = e.list.length + 2;

  return `import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { normalize } from "@/lib/search";
import { buildPaginationItems } from "@/lib/pagination";
import {
  fetch${e.key},
  inactivate${e.key.replace(/s$/, "")},
} from "@/services/${e.serviceFile}";
import type { ${e.type} } from "@/types/entities/Fluxodocs";
import {
  Fluxodocs${e.key}Modal,
  type Fluxodocs${e.key}ModalMode,
} from "./components/Fluxodocs${e.key}Modal";

const PAGE_SIZE = 20;

${optionConsts}

export default function Fluxodocs${e.key}Page() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<${e.type}[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);
  const [inactivatingId, setInactivatingId] = useState<number | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Fluxodocs${e.key}ModalMode>("create");
  const [selected, setSelected] = useState<${e.type} | null>(null);

  function openModal(mode: Fluxodocs${e.key}ModalMode, r: ${e.type} | null) {
    setModalMode(mode);
    setSelected(r);
    setModalOpen(true);
  }

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  async function load() {
    setLoading(true);
    try {
      const res = await fetch${e.key}();
      setData(res.filter((r) => r.situacaoId === 1));
    } catch {
      toast.error("Erro ao carregar ${e.title.plur.toLowerCase()}");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function confirmInactivate() {
    if (inactivatingId == null) return;
    try {
      await inactivate${e.key.replace(/s$/, "")}(inactivatingId);
      toast.success("Registro inativado com sucesso");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar registro");
    }
  }

  const visible = useMemo(() => {
    const term = normalize(debounced.trim());
    if (!term) return data;
    return data.filter((r) => ${searchClause});
  }, [data, debounced]);

  const totalPages = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(
    () => visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [visible, currentPage],
  );
  const startItem = visible.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endItem = Math.min(currentPage * PAGE_SIZE, visible.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">${e.title.plur}</h1>
          <p className="text-sm text-muted-foreground">
            Configurações &gt; Fluxo de Documentos &gt; ${e.title.plur}
          </p>
        </div>
        <Button onClick={() => openModal("create", null)}>
          <Plus className="mr-1 size-4" />
          Novo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de ${e.title.plur.toLowerCase()}</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar..."
              value={search}
              onChange={(ev) => handleSearchChange(ev.target.value)}
              aria-label="Buscar"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
${listHeaders}
                  <TableHead className="w-[120px]">Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={${colspan}} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : paginated.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={${colspan}}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginated.map((r) => (
                    <TableRow key={r.id}>
${listCells}
                      <TableCell>
                        <Badge variant={r.situacaoId === 1 ? "default" : "secondary"}>
                          {r.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => openModal("view", r)}
                          onEdit={() => openModal("edit", r)}
                          onInactivate={() => setInactivatingId(r.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {visible.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
              <div>
                Exibindo {startItem}-{endItem} de {visible.length} registro
                {visible.length === 1 ? "" : "s"}
              </div>
              {totalPages > 1 && (
                <Pagination className="mx-0 w-auto justify-end">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPage((p) => Math.max(1, p - 1));
                        }}
                        aria-disabled={currentPage === 1}
                      />
                    </PaginationItem>
                    {buildPaginationItems(currentPage, totalPages).map((it, i) =>
                      it === "ellipsis" ? (
                        <PaginationItem key={\`e-\${i}\`}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      ) : (
                        <PaginationItem key={it}>
                          <PaginationLink
                            href="#"
                            isActive={it === currentPage}
                            onClick={(ev) => {
                              ev.preventDefault();
                              setPage(it);
                            }}
                          >
                            {it}
                          </PaginationLink>
                        </PaginationItem>
                      ),
                    )}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(ev) => {
                          ev.preventDefault();
                          setPage((p) => Math.min(totalPages, p + 1));
                        }}
                        aria-disabled={currentPage === totalPages}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Fluxodocs${e.key}Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        mode={modalMode}
        registro={selected}
        onSaved={load}
      />

      <AlertDialog
        open={inactivatingId != null}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar registro?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro será marcado como <strong>Inativo</strong> (exclusão lógica).
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmInactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
`;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

async function writeFile(p, content) {
  await ensureDir(path.dirname(p));
  await fs.writeFile(p, content, "utf8");
}

async function rmIfExists(p) {
  try { await fs.rm(p, { recursive: true, force: true }); } catch { }
}

(async () => {
  const created = [];

  for (const e of ENTITIES) {
    const svcPath = path.join(ROOT, "src/services", `${e.serviceFile}.ts`);
    const pageDir = path.join(ROOT, "src/pages", e.folder);
    const idxPath = path.join(pageDir, "index.tsx");
    const formPath = path.join(pageDir, "components", `Fluxodocs${e.key}Form.tsx`);
    const modalPath = path.join(pageDir, "components", `Fluxodocs${e.key}Modal.tsx`);

    // Remove old generic page index first (we will overwrite anyway)
    await writeFile(svcPath, serviceTemplate(e));
    await writeFile(idxPath, indexTemplate(e));
    await writeFile(formPath, formTemplate(e));
    await writeFile(modalPath, modalTemplate(e));

    created.push(svcPath, idxPath, formPath, modalPath);
  }

  // Move seeds into a domain-free helper file (lib/fluxodocsMocks.ts)
  // so services can keep a stable mock without depending on the engine folder.
  const seedsSrc = path.join(ROOT, "src/lib/fluxodocs/seeds.ts");
  const seedsDst = path.join(ROOT, "src/lib/fluxodocsMocks.ts");
  try {
    let content = await fs.readFile(seedsSrc, "utf8");
    // The original file imports from "@/types/entities/Fluxodocs" already — keep as-is.
    content = `/**
 * Mocks (>= 20 itens) das entidades fluxodocs_*. Apenas dados.
 * Substitua por chamadas reais de API quando o backend estiver disponível.
 */
` +
      content.replace(/^\/\*\*[\s\S]*?\*\/\s*/m, "");
    await writeFile(seedsDst, content);
  } catch (err) {
    console.error("Falha ao mover seeds:", err);
    process.exit(1);
  }

  // Remove engine genérico
  await rmIfExists(path.join(ROOT, "src/lib/fluxodocs"));
  await rmIfExists(path.join(ROOT, "src/services/fluxodocs.ts"));

  console.log(`Gerados ${created.length} arquivos para ${ENTITIES.length} entidades.`);
})();
