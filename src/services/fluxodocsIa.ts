/**
 * Heurísticas determinísticas para risco, score de fila, recomendação e
 * sugestão de motivo de devolução. Mock — pode ser substituído por
 * Lovable AI Gateway no futuro sem alterar a interface.
 */
import { conveniosMock } from "@/lib/fluxodocsOperacionalMocks";
import type {
  ChecklistDraft,
  RiscoNivel,
  FluxoCompleto,
} from "@/types/entities/FluxodocsOperacional";

export interface RiscoResultado {
  nivel: RiscoNivel;
  riscoGlosa: number; // 0..1
  recomendacao: string;
  bloqueiaEnvio: boolean;
}

export function calcularRisco(
  checklist: ChecklistDraft[],
  convenioId: number | null,
): RiscoResultado {
  const conv = convenioId ? conveniosMock.find(c => c.id === convenioId) : null;
  const histGlosa = conv?.historicoGlosa ?? 0.10;

  const obrig = checklist.filter(c => c.obrigatorio);
  const pendentes = obrig.filter(c => c.status === "PENDENTE");
  const bloqueantes = checklist.filter(c => c.status === "BLOQUEANTE" || (c.bloqueiaEnvio && c.status === "PENDENTE"));
  const justificados = checklist.filter(c => c.status === "JUSTIFICADO");
  const justifPendAprov = justificados.filter(c => c.exigeAprovacao && c.aprovacaoStatus === "PENDENTE");
  const justifReprov = justificados.filter(c => c.aprovacaoStatus === "REPROVADO");

  if (bloqueantes.length || justifReprov.length) {
    return {
      nivel: "BLOQUEIO",
      riscoGlosa: Math.min(1, histGlosa + 0.5),
      recomendacao: justifReprov.length
        ? "A justificativa foi reprovada. Corrija o item ou anexe o documento obrigatório."
        : "Existem itens bloqueantes no checklist. Resolva antes de enviar.",
      bloqueiaEnvio: true,
    };
  }

  if (pendentes.length) {
    return {
      nivel: "ALTO",
      riscoGlosa: Math.min(1, histGlosa + 0.35),
      recomendacao: "Documento obrigatório pendente. Alto risco de glosa.",
      bloqueiaEnvio: true,
    };
  }

  if (justifPendAprov.length) {
    return {
      nivel: "MEDIO",
      riscoGlosa: Math.min(1, histGlosa + 0.15),
      recomendacao: "Documento justificado. Recomenda-se aprovação da coordenação antes do envio.",
      bloqueiaEnvio: true,
    };
  }

  if (justificados.length) {
    return {
      nivel: "MEDIO",
      riscoGlosa: Math.min(1, histGlosa + 0.10),
      recomendacao: conv && conv.historicoGlosa > 0.20
        ? `Convênio possui histórico de glosa para ausência deste documento (${Math.round(conv.historicoGlosa * 100)}%).`
        : "Documento justificado. Risco médio de glosa.",
      bloqueiaEnvio: false,
    };
  }

  const todosOk = checklist.every(c => c.status === "ANEXADO" || c.status === "CONFIRMADO");
  return {
    nivel: "BAIXO",
    riscoGlosa: Math.max(0.02, histGlosa * 0.4),
    recomendacao: todosOk
      ? "Todos os documentos válidos. Baixo risco."
      : "Documento confirmado no sistema. Baixo risco.",
    bloqueiaEnvio: false,
  };
}

export function calcularScoreFila(args: {
  prioridadePeso: number;
  iaRiscoAtraso: number;
  iaRiscoGlosa: number;
  iaComplexidade: number;
  convenioFator: number;
  slaHorasRestantes: number;
}): number {
  // Pesos vindos de seedParametrosIa (espelho determinístico):
  // priori 0.30 + sla 0.25 + atraso 0.20 + glosa 0.10 + complex 0.10 + conv 0.05
  const slaScore = args.slaHorasRestantes <= 0
    ? 1
    : Math.max(0, 1 - args.slaHorasRestantes / 168); // 7 dias = 168h

  const score =
    (args.prioridadePeso / 10) * 0.30 +
    slaScore * 0.25 +
    args.iaRiscoAtraso * 0.20 +
    args.iaRiscoGlosa * 0.10 +
    args.iaComplexidade * 0.10 +
    args.convenioFator * 0.05;

  return Math.round(score * 1000) / 1000;
}

export function sugerirMotivoDevolucao(observacao?: string | null): string {
  const opcoes = [
    "Falta de assinatura",
    "Documento incompleto",
    "Divergência de dados",
    "Documento inválido",
    "Pendência de convênio",
  ];
  if (!observacao) return opcoes[0];
  const lower = observacao.toLowerCase();
  if (lower.includes("assin")) return opcoes[0];
  if (lower.includes("incompl")) return opcoes[1];
  if (lower.includes("diverg") || lower.includes("erro")) return opcoes[2];
  if (lower.includes("inválid") || lower.includes("invalid")) return opcoes[3];
  if (lower.includes("conv")) return opcoes[4];
  return opcoes[0];
}

export function ordenarFila(fluxos: FluxoCompleto[]): FluxoCompleto[] {
  return [...fluxos].sort((a, b) => {
    if (b.scoreFila !== a.scoreFila) return b.scoreFila - a.scoreFila;
    const slaA = a.protocolo.slaStatus === "ATRASADO" ? 1 : 0;
    const slaB = b.protocolo.slaStatus === "ATRASADO" ? 1 : 0;
    if (slaB !== slaA) return slaB - slaA;
    if (b.protocolo.prioridadeId !== a.protocolo.prioridadeId)
      return b.protocolo.prioridadeId - a.protocolo.prioridadeId;
    return new Date(a.protocolo.created).getTime() - new Date(b.protocolo.created).getTime();
  });
}
