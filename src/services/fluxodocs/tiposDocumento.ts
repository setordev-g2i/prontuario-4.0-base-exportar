import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string]> = [
  ["Guia SP/SADT", "GUIA", "#3b82f6"],
  ["Guia de Internação", "GUIA", "#10b981"],
  ["Guia de Honorários", "GUIA", "#8b5cf6"],
  ["Conta Hospitalar", "CONTA", "#ef4444"],
  ["Resumo de Alta", "RELATORIO", "#f59e0b"],
  ["Laudo Médico", "LAUDO", "#ec4899"],
  ["Prescrição Médica", "PRESCRICAO", "#14b8a6"],
  ["Evolução Médica", "EVOLUCAO", "#06b6d4"],
  ["Termo de Consentimento", "TERMO", "#6366f1"],
  ["Identidade do Paciente", "DOCUMENTO", "#a855f7"],
  ["CPF do Paciente", "DOCUMENTO", "#0ea5e9"],
  ["Carteirinha do Convênio", "DOCUMENTO", "#22c55e"],
  ["Pedido Médico", "PEDIDO", "#eab308"],
  ["Autorização Prévia", "AUTORIZACAO", "#f43f5e"],
  ["Relatório de Cirurgia", "RELATORIO", "#84cc16"],
  ["Ofício", "OFICIO", "#dc2626"],
  ["Recurso de Glosa", "RECURSO", "#fb923c"],
  ["Notificação", "NOTIFICACAO", "#60a5fa"],
  ["Cópia de Prontuário", "PRONTUARIO", "#f472b6"],
  ["Boletim de Atendimento", "BOLETIM", "#34d399"],
  ["Anexo Genérico", "ANEXO", "#94a3b8"],
];

const seed = () =>
  ITEMS.map(([nome, categoria, cor], i) => ({
    id: i + 1,
    nome,
    categoria,
    cor,
    ...baseAudit(),
  })) as FluxodocsTipoDocumento[];

export const tiposDocumentoService = makeMockService<FluxodocsTipoDocumento>(seed);
