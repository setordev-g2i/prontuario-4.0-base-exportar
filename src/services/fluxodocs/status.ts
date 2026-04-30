import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string, string, boolean, boolean]> = [
  ["Aberto", "ABERTO", "INICIAL", "#3b82f6", true, false],
  ["Em Trânsito", "EM_TRANSITO", "INTERMEDIARIO", "#06b6d4", false, false],
  ["Aguardando Recebimento", "AGUARDANDO_RECEBIMENTO", "INTERMEDIARIO", "#eab308", false, false],
  ["Recebido", "RECEBIDO", "INTERMEDIARIO", "#10b981", false, false],
  ["Em Análise", "EM_ANALISE", "INTERMEDIARIO", "#8b5cf6", false, false],
  ["Aceito", "ACEITO", "FINAL", "#22c55e", false, true],
  ["Aceito Parcialmente", "ACEITO_PARCIAL", "INTERMEDIARIO", "#84cc16", false, false],
  ["Devolvido", "DEVOLVIDO", "INTERMEDIARIO", "#f59e0b", false, false],
  ["Reenviado", "REENVIADO", "INTERMEDIARIO", "#a855f7", false, false],
  ["Cancelado", "CANCELADO", "FINAL", "#ef4444", false, true],
  ["Bloqueado", "BLOQUEADO", "INTERMEDIARIO", "#dc2626", false, false],
  ["Aguardando Aprovação", "AGUARDANDO_APROVACAO", "INTERMEDIARIO", "#fb923c", false, false],
  ["Aprovado", "APROVADO", "INTERMEDIARIO", "#10b981", false, false],
  ["Reprovado", "REPROVADO", "INTERMEDIARIO", "#f43f5e", false, false],
  ["Em Auditoria", "EM_AUDITORIA", "INTERMEDIARIO", "#6366f1", false, false],
  ["Em Cobrança", "EM_COBRANCA", "INTERMEDIARIO", "#0ea5e9", false, false],
  ["Em Recurso", "EM_RECURSO", "INTERMEDIARIO", "#9333ea", false, false],
  ["Arquivado", "ARQUIVADO", "FINAL", "#94a3b8", false, true],
  ["Encerrado", "ENCERRADO", "FINAL", "#64748b", false, true],
  ["Pendente Documentação", "PENDENTE_DOC", "INTERMEDIARIO", "#facc15", false, false],
  ["Em Justificativa", "EM_JUSTIFICATIVA", "INTERMEDIARIO", "#f472b6", false, false],
];

const seed = () =>
  ITEMS.map(([nome, codigo, tipo, cor, permiteEdicao, finalizador], i) => ({
    id: i + 1,
    nome,
    codigo,
    tipo,
    cor,
    permiteEdicao,
    finalizador,
    ordem: i + 1,
    ...baseAudit(),
  })) as FluxodocsStatus[];

export const statusService = makeMockService<FluxodocsStatus>(seed);
