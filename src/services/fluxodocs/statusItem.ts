import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsStatusItem } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string, boolean]> = [
  ["Pendente", "PENDENTE", "#eab308", false],
  ["Aceito", "ACEITO", "#22c55e", true],
  ["Devolvido", "DEVOLVIDO", "#f59e0b", false],
  ["Em Análise", "EM_ANALISE", "#8b5cf6", false],
  ["Aceito Parcialmente", "ACEITO_PARCIAL", "#84cc16", false],
  ["Bloqueado", "BLOQUEADO", "#ef4444", false],
  ["Justificado", "JUSTIFICADO", "#fb923c", false],
  ["Anexado", "ANEXADO", "#06b6d4", false],
  ["Confirmado", "CONFIRMADO", "#10b981", false],
  ["Cancelado", "CANCELADO", "#dc2626", true],
  ["Aguardando Documentação", "AGUARDANDO_DOC", "#facc15", false],
  ["Em Auditoria", "EM_AUDITORIA", "#6366f1", false],
  ["Aprovado", "APROVADO", "#22c55e", false],
  ["Reprovado", "REPROVADO", "#f43f5e", false],
  ["Reenviado", "REENVIADO", "#a855f7", false],
  ["Recebido", "RECEBIDO", "#10b981", false],
  ["Em Recurso", "EM_RECURSO", "#9333ea", false],
  ["Glosado", "GLOSADO", "#ef4444", false],
  ["Pago", "PAGO", "#22c55e", true],
  ["Encerrado", "ENCERRADO", "#64748b", true],
  ["Arquivado", "ARQUIVADO", "#94a3b8", true],
];

const seed = () =>
  ITEMS.map(([nome, codigo, cor, finalizador], i) => ({
    id: i + 1,
    nome,
    codigo,
    cor,
    finalizador,
    ordem: i + 1,
    ...baseAudit(),
  })) as FluxodocsStatusItem[];

export const statusItemService = makeMockService<FluxodocsStatusItem>(seed);
