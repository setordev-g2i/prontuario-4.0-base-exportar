/**
 * Cálculo de SLA por convênio com cascata de busca:
 *  1. convênio + tipoDoc + setorDestino + prioridade
 *  2. tipoDoc + setorDestino + prioridade
 *  3. tipoDoc + prioridade
 *  4. prioridade
 */
import { seedParametrosSla } from "@/lib/fluxodocsMocks";
import { conveniosMock } from "@/lib/fluxodocsOperacionalMocks";
import type { SlaCalculo, SlaStatus } from "@/types/entities/FluxodocsOperacional";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";

const params = seedParametrosSla();

interface CalcArgs {
  convenioId: number | null;
  tipoDocumentoId: number | null;
  setorDestinoId: number;
  prioridadeId: number;
  riscoBase?: number;
}

function buscarParam(args: CalcArgs): { p: FluxodocsParametroSla | null; origem: string } {
  const { convenioId, tipoDocumentoId, setorDestinoId, prioridadeId } = args;
  let p: FluxodocsParametroSla | undefined;

  if (convenioId && tipoDocumentoId) {
    p = params.find(x => x.convenioId === convenioId && x.tipoDocumentoId === tipoDocumentoId
      && x.setorDestinoId === setorDestinoId && x.prioridadeId === prioridadeId);
    if (p) return { p, origem: "convênio + tipo doc + setor + prioridade" };
  }
  if (tipoDocumentoId) {
    p = params.find(x => x.tipoDocumentoId === tipoDocumentoId
      && x.setorDestinoId === setorDestinoId && x.prioridadeId === prioridadeId);
    if (p) return { p, origem: "tipo doc + setor + prioridade" };

    p = params.find(x => x.tipoDocumentoId === tipoDocumentoId && x.prioridadeId === prioridadeId);
    if (p) return { p, origem: "tipo doc + prioridade" };
  }
  p = params.find(x => x.prioridadeId === prioridadeId);
  return { p: p ?? null, origem: p ? "prioridade" : "padrão" };
}

export function calcularSla(args: CalcArgs): SlaCalculo {
  const { p, origem } = buscarParam(args);
  const prazoHoras = p?.prazoHoras ?? 72;

  const conv = args.convenioId ? conveniosMock.find(c => c.id === args.convenioId) : null;
  const histAtraso = conv?.historicoAtraso ?? 0.15;
  const riscoBase = args.riscoBase ?? 0;
  const iaRiscoAtraso = Math.min(1, Math.max(0,
    histAtraso * 0.6 + riscoBase * 0.3 + (args.prioridadeId === 3 ? 0.15 : 0)
  ));

  let slaStatus: SlaStatus = "NO_PRAZO";
  if (iaRiscoAtraso >= 0.7) slaStatus = "ALERTA";

  const slaPrevistoEm = new Date(Date.now() + prazoHoras * 3600_000).toISOString();
  return {
    slaPrevistoEm,
    prazoHoras,
    slaStatus,
    iaRiscoAtraso: Math.round(iaRiscoAtraso * 100) / 100,
    origem,
  };
}

export function statusSlaDeData(slaPrevistoEm: string | null, risco: number): SlaStatus {
  if (!slaPrevistoEm) return "NO_PRAZO";
  const diff = new Date(slaPrevistoEm).getTime() - Date.now();
  if (diff < 0) return "ATRASADO";
  if (risco >= 0.7) return "ALERTA";
  if (diff < 12 * 3600_000) return "EM_RISCO";
  return "NO_PRAZO";
}
