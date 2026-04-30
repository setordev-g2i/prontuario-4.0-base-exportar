/**
 * Seeds iniciais (>= 20 itens quando aplicável) para todos os mocks
 * do módulo Fluxo de Documentos. Cada entidade gera um array com timestamps
 * e auditoria padronizados.
 */
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
  FluxodocsDocumentoObrigatorioConvenio,
  FluxodocsChecklistDocumental,
  FluxodocsAprovacaoJustificativa,
  FluxodocsProtocolo,
  FluxodocsProtocoloItem,
  FluxodocsLog,
} from "@/types/entities/Fluxodocs";

const NOW = new Date().toISOString();
const audit = (id: number, situacaoId: 1 | 2 = 1) => ({
  id,
  situacaoId,
  userCreatedId: 1,
  created: NOW,
  userModifiedId: 1,
  modified: NOW,
});

// repeat helper to inflate to >= 20 items
function inflate<T>(base: T[], min = 22): T[] {
  if (base.length >= min) return base;
  const out: T[] = [...base];
  let i = base.length;
  while (out.length < min) {
    const src = base[i % base.length] as T & { id: number };
    out.push({ ...src, id: i + 1 } as T);
    i++;
  }
  return out;
}

export function seedTiposMovimentacao(): FluxodocsTipoMovimentacao[] {
  const base = [
    "ENVIO", "REMESSA", "DEVOLUCAO", "REENVIO", "INTERNO", "RECEBIMENTO_MANUAL",
  ].map((codigo, i) => ({
    ...audit(i + 1),
    nome: codigo.replace("_", " "),
    codigo,
    descricao: `Movimentação ${codigo.toLowerCase()}`,
    ordem: i + 1,
  }));
  return inflate(base);
}

export function seedPrioridades(): FluxodocsPrioridade[] {
  const base: FluxodocsPrioridade[] = [
    { ...audit(1), nome: "Normal", codigo: "NORMAL", peso: 1, cor: "#10b981", ordem: 1 },
    { ...audit(2), nome: "Alta", codigo: "ALTA", peso: 5, cor: "#f59e0b", ordem: 2 },
    { ...audit(3), nome: "Urgente", codigo: "URGENTE", peso: 10, cor: "#ef4444", ordem: 3 },
  ];
  return inflate(base);
}

export function seedStatus(): FluxodocsStatus[] {
  const base: FluxodocsStatus[] = [
    { ...audit(1), nome: "Aberto", codigo: "ABERTO", tipo: "INICIAL", ordem: 1, cor: "#3b82f6", permiteEdicao: true, finalizador: false },
    { ...audit(2), nome: "Enviado", codigo: "ENVIADO", tipo: "FLUXO", ordem: 2, cor: "#6366f1", permiteEdicao: false, finalizador: false },
    { ...audit(3), nome: "Recebido", codigo: "RECEBIDO", tipo: "FLUXO", ordem: 3, cor: "#0ea5e9", permiteEdicao: false, finalizador: false },
    { ...audit(4), nome: "Devolvido", codigo: "DEVOLVIDO", tipo: "EXCECAO", ordem: 4, cor: "#f59e0b", permiteEdicao: false, finalizador: false },
    { ...audit(5), nome: "Aceito Parcial", codigo: "ACEITO_PARCIAL", tipo: "EXCECAO", ordem: 5, cor: "#a78bfa", permiteEdicao: false, finalizador: false },
    { ...audit(6), nome: "Reenviado", codigo: "REENVIADO", tipo: "FLUXO", ordem: 6, cor: "#22c55e", permiteEdicao: false, finalizador: false },
    { ...audit(7), nome: "Cancelado", codigo: "CANCELADO", tipo: "FINAL", ordem: 7, cor: "#94a3b8", permiteEdicao: false, finalizador: true },
    { ...audit(8), nome: "Finalizado", codigo: "FINALIZADO", tipo: "FINAL", ordem: 8, cor: "#16a34a", permiteEdicao: false, finalizador: true },
  ];
  return inflate(base);
}

export function seedTiposItem(): FluxodocsTipoItem[] {
  const base = ["CONTA", "ATENDIMENTO", "PACIENTE", "DOCUMENTO", "OFICIO", "MANUAL"]
    .map((c, i) => ({ ...audit(i + 1), nome: c, codigo: c, descricao: null, ordem: i + 1 }));
  return inflate(base);
}

export function seedStatusItem(): FluxodocsStatusItem[] {
  const base: FluxodocsStatusItem[] = [
    { ...audit(1), nome: "Pendente", codigo: "PENDENTE", ordem: 1, cor: "#f59e0b", finalizador: false },
    { ...audit(2), nome: "Aceito", codigo: "ACEITO", ordem: 2, cor: "#16a34a", finalizador: true },
    { ...audit(3), nome: "Devolvido", codigo: "DEVOLVIDO", ordem: 3, cor: "#ef4444", finalizador: false },
  ];
  return inflate(base);
}

export function seedSetores(): FluxodocsSetor[] {
  const setores = [
    "Recepção", "Faturamento", "Auditoria", "Glosas", "TISS", "Convênios",
    "Diretoria Clínica", "Arquivo", "Financeiro", "Cobrança",
    "Recurso de Glosa", "SAME", "Recepção CC", "Centro Cirúrgico",
    "Internação", "Pronto Atendimento", "Almoxarifado", "Farmácia",
    "Compras", "Jurídico", "Qualidade", "TI",
  ];
  return setores.map((nome, i) => ({
    ...audit(i + 1),
    nome,
    sigla: nome.substring(0, 4).toUpperCase().replace(/\s/g, ""),
    cor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#0ea5e9"][i % 6],
    responsavelId: null,
    participaFluxo: true,
  }));
}

export function seedTiposDocumento(): FluxodocsTipoDocumento[] {
  const base = [
    "Conta Médica", "Guia SP/SADT", "Guia Internação", "Guia Consulta",
    "Laudo Médico", "Receituário", "Solicitação de Exame", "Termo de Consentimento",
    "Relatório Cirúrgico", "Evolução Clínica", "Prescrição", "Justificativa Técnica",
    "Recurso de Glosa", "Contestação", "Documento Pessoal", "Carteirinha",
    "Autorização Prévia", "Boletim de Atendimento", "Anexo Geral", "Pedido Médico",
    "Atestado", "Declaração",
  ];
  return base.map((nome, i) => ({
    ...audit(i + 1),
    nome,
    categoria: i < 8 ? "FATURAMENTO" : i < 14 ? "CLINICO" : "ADMINISTRATIVO",
    cor: ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"][i % 4],
  }));
}

export function seedMotivos(): FluxodocsMotivo[] {
  const tipos = ["ENVIO", "DEVOLUCAO", "CANCELAMENTO", "REENVIO", "JUSTIFICATIVA"];
  const nomes = [
    "Envio para auditoria", "Documento ilegível", "Falta de assinatura",
    "Falta carteirinha", "CID inconsistente", "Procedimento divergente",
    "Solicitação de complementação", "Cancelamento administrativo",
    "Cancelamento pelo paciente", "Reenvio após correção",
    "Justificativa de ausência", "Documento não disponível",
    "Falta autorização", "Erro no sistema", "Duplicidade",
    "Reenvio por glosa", "Justificativa técnica", "Documento atualizado",
    "Anexo digital", "Envio rotineiro", "Devolução por não conformidade", "Outros",
  ];
  return nomes.map((nome, i) => ({
    ...audit(i + 1),
    nome,
    tipo: tipos[i % tipos.length],
  }));
}

export function seedRegrasFluxo(): FluxodocsRegraFluxo[] {
  const base: FluxodocsRegraFluxo[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      setorOrigemId: (i % 6) + 1,
      setorDestinoId: ((i + 1) % 6) + 1,
      tipoDocumentoId: (i % 10) + 1,
      tipoMovimentacaoId: (i % 6) + 1,
    });
  }
  return base;
}

export function seedParametrosSla(): FluxodocsParametroSla[] {
  const base: FluxodocsParametroSla[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      tipoDocumentoId: (i % 10) + 1,
      setorDestinoId: (i % 6) + 1,
      prioridadeId: (i % 3) + 1,
      convenioId: i % 3 === 0 ? null : (i % 5) + 1,
      prazoHoras: 24 + (i % 5) * 24,
    });
  }
  return base;
}

export function seedParametrosIa(): FluxodocsParametroIa[] {
  const base = [
    { nome: "Peso Prioridade", chave: "peso_prioridade", valor: "0.30" },
    { nome: "Peso SLA", chave: "peso_sla", valor: "0.25" },
    { nome: "Peso Risco Atraso", chave: "peso_risco_atraso", valor: "0.20" },
    { nome: "Peso Glosa", chave: "peso_glosa", valor: "0.10" },
    { nome: "Peso Complexidade", chave: "peso_complexidade", valor: "0.10" },
    { nome: "Peso Convênio", chave: "peso_convenio", valor: "0.05" },
    { nome: "Limite Alerta SLA", chave: "limite_alerta_sla", valor: "0.7" },
    { nome: "Limite Risco Alto", chave: "limite_risco_alto", valor: "0.85" },
  ];
  const items = base.map((b, i) => ({ ...audit(i + 1), ...b }));
  return inflate(items);
}

export function seedWorkflows(): FluxodocsWorkflowTipoDocumento[] {
  const base: FluxodocsWorkflowTipoDocumento[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      tipoDocumentoId: (i % 10) + 1,
      nome: `Workflow ${i + 1}`,
      descricao: `Fluxo padrão para o tipo de documento #${(i % 10) + 1}`,
    });
  }
  return base;
}

export function seedWorkflowEtapas(): FluxodocsWorkflowEtapa[] {
  const acoes = ["ENVIAR", "RECEBER", "DEVOLVER", "REENVIAR", "ACEITAR", "CANCELAR"];
  const base: FluxodocsWorkflowEtapa[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      workflowId: (i % 8) + 1,
      statusOrigemId: (i % 7) + 1,
      statusDestinoId: ((i + 1) % 7) + 1,
      acao: acoes[i % acoes.length],
      ordem: (i % 5) + 1,
      exigeMotivo: i % 2 === 0,
      exigeObservacao: i % 3 === 0,
      permiteReversao: i % 4 === 0,
      perfilPermitido: ["TODOS", "AUDITOR", "FATURISTA", "GESTOR"][i % 4],
    });
  }
  return base;
}

export function seedDocumentosObrigatoriosConvenio(): FluxodocsDocumentoObrigatorioConvenio[] {
  const base: FluxodocsDocumentoObrigatorioConvenio[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      convenioId: (i % 5) + 1,
      tipoDocumentoId: (i % 10) + 1,
      tipoMovimentacaoId: i % 2 === 0 ? (i % 6) + 1 : null,
      prioridadeId: (i % 3) + 1,
      obrigatorio: i % 2 === 0,
      bloqueiaEnvio: i % 3 === 0,
      exigeJustificativaAusencia: i % 4 === 0,
      exigeAprovacaoJustificativa: i % 5 === 0,
      descricao: `Regra documental #${i + 1}`,
    });
  }
  return base;
}

export function seedChecklist(): FluxodocsChecklistDocumental[] {
  const status: FluxodocsChecklistDocumental["statusChecklist"][] =
    ["PENDENTE", "ANEXADO", "CONFIRMADO", "JUSTIFICADO", "BLOQUEANTE"];
  const base: FluxodocsChecklistDocumental[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      protocoloId: (i % 8) + 1,
      itemId: (i % 8) + 1,
      convenioId: (i % 5) + 1,
      tipoDocumentoId: (i % 10) + 1,
      documentoObrigatorioId: (i % 10) + 1,
      statusChecklist: status[i % status.length],
      documentoAnexadoId: i % 3 === 0 ? i + 100 : null,
      justificativaAusencia: i % 4 === 0 ? "Documento não disponível no momento" : null,
      iaSugestao: i % 5 === 0 ? "Anexar documento original" : null,
      iaRiscoGlosa: Math.round((i / 22) * 100) / 100,
    });
  }
  return base;
}

export function seedAprovacoes(): FluxodocsAprovacaoJustificativa[] {
  const status: FluxodocsAprovacaoJustificativa["statusAprovacao"][] =
    ["PENDENTE", "APROVADO", "REPROVADO", "CANCELADO"];
  const base: FluxodocsAprovacaoJustificativa[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      checklistId: (i % 22) + 1,
      protocoloId: (i % 8) + 1,
      itemId: (i % 8) + 1,
      justificativa: `Justificativa para o item #${i + 1}`,
      statusAprovacao: status[i % status.length],
      solicitadoPorId: 1,
      solicitadoEm: NOW,
      aprovadoPorId: i % 2 === 0 ? 1 : null,
      aprovadoEm: i % 2 === 0 ? NOW : null,
      observacaoAprovador: i % 3 === 0 ? "Aprovado conforme política" : null,
    });
  }
  return base;
}

export function seedProtocolos(): FluxodocsProtocolo[] {
  const base: FluxodocsProtocolo[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      numero: `FD-${String(2026000 + i).padStart(7, "0")}`,
      tipoMovimentacaoId: (i % 6) + 1,
      setorOrigemId: (i % 6) + 1,
      setorDestinoId: ((i + 2) % 6) + 1,
      prioridadeId: (i % 3) + 1,
      motivoId: (i % 22) + 1,
      statusId: (i % 8) + 1,
      observacao: i % 3 === 0 ? "Envio rotineiro" : null,
      slaPrevistoEm: NOW,
      slaRealizadoEm: i % 2 === 0 ? NOW : null,
      slaStatus: ["NO_PRAZO", "ATRASADO", "EM_RISCO"][i % 3],
      iaRiscoAtraso: Math.round((i / 22) * 100) / 100,
      iaScoreComplexidade: Math.round((i / 22) * 100) / 100,
      iaScorePrioridade: Math.round((i / 22) * 100) / 100,
      iaRecomendacao: null,
      ordemFila: i + 1,
      protocoloOrigemId: i > 5 && i % 4 === 0 ? i - 3 : null,
    });
  }
  return base;
}

export function seedProtocoloItens(): FluxodocsProtocoloItem[] {
  const base: FluxodocsProtocoloItem[] = [];
  for (let i = 0; i < 22; i++) {
    base.push({
      ...audit(i + 1),
      protocoloId: (i % 8) + 1,
      tipoItemId: (i % 6) + 1,
      tipoDocumentoId: (i % 10) + 1,
      contaId: (i % 10) + 1,
      atendimentoId: (i % 10) + 1,
      clienteId: (i % 15) + 1,
      convenioId: (i % 5) + 1,
      descricaoManual: i % 4 === 0 ? `Item manual ${i + 1}` : null,
      statusItemId: (i % 3) + 1,
      motivoDevolucaoId: i % 5 === 0 ? (i % 22) + 1 : null,
      observacao: null,
      iaProbabilidadeGlosa: Math.round((i / 22) * 100) / 100,
      iaSugestaoDevolucao: null,
    });
  }
  return base;
}

export function seedLogs(): FluxodocsLog[] {
  const acoes = [
    "CRIADO", "ENVIADO", "RECEBIDO", "DEVOLVIDO", "ACEITO_PARCIAL",
    "REENVIADO", "CANCELADO", "CHECKLIST_GERADO", "DOCUMENTO_ANEXADO",
    "DOCUMENTO_CONFIRMADO", "JUSTIFICATIVA_CRIADA",
    "JUSTIFICATIVA_APROVACAO_SOLICITADA", "JUSTIFICATIVA_APROVADA",
    "JUSTIFICATIVA_REPROVADA", "ENVIO_BLOQUEADO",
    "IA_SLA_CALCULADA", "IA_FILA_REORDENADA",
  ];
  const base: FluxodocsLog[] = [];
  for (let i = 0; i < 30; i++) {
    base.push({
      ...audit(i + 1),
      protocoloId: (i % 8) + 1,
      usuarioId: 1,
      setorId: (i % 6) + 1,
      acao: acoes[i % acoes.length],
      payload: JSON.stringify({ origem: "sistema", index: i }),
    });
  }
  return base;
}
