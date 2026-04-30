import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, number, string]> = [
  ["Normal", "NORMAL", 1, "#10b981"],
  ["Alta", "ALTA", 5, "#f59e0b"],
  ["Urgente", "URGENTE", 10, "#ef4444"],
  ["Baixa", "BAIXA", 0, "#94a3b8"],
  ["Crítica", "CRITICA", 20, "#dc2626"],
  ["Média", "MEDIA", 3, "#3b82f6"],
  ["Imediata", "IMEDIATA", 25, "#9333ea"],
  ["Programada", "PROGRAMADA", 2, "#06b6d4"],
  ["SLA Estourado", "SLA_ESTOURADO", 30, "#f43f5e"],
  ["Auditoria", "AUDITORIA", 8, "#8b5cf6"],
  ["Recurso", "RECURSO", 12, "#a855f7"],
  ["Glosa", "GLOSA", 15, "#fb923c"],
  ["Internação", "INTERNACAO", 7, "#22c55e"],
  ["Ambulatório", "AMBULATORIO", 4, "#60a5fa"],
  ["Convênio Premium", "CONV_PREMIUM", 18, "#facc15"],
  ["Diretoria", "DIRETORIA", 22, "#ec4899"],
  ["Manual", "MANUAL", 6, "#14b8a6"],
  ["Automática", "AUTOMATICA", 9, "#84cc16"],
  ["Reprocessamento", "REPROCESSO", 11, "#eab308"],
  ["Cobrança", "COBRANCA", 13, "#f472b6"],
  ["Financeira", "FINANCEIRA", 14, "#0ea5e9"],
];

const seed = () =>
  ITEMS.map(([nome, codigo, peso, cor], i) => ({
    id: i + 1,
    nome,
    codigo,
    peso,
    cor,
    ordem: i + 1,
    ...baseAudit(),
  })) as FluxodocsPrioridade[];

export const prioridadesService = makeMockService<FluxodocsPrioridade>(seed);
