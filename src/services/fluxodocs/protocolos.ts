import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";

const SLA_STATUS = ["NO_PRAZO","ALERTA","ESTOURADO","CONCLUIDO"];

const seed = () => {
  const data: FluxodocsProtocolo[] = [];
  const baseDate = Date.now();
  for (let i = 0; i < 21; i++) {
    data.push({
      id: i + 1,
      numero: `FD-${String(20250000 + i + 1)}`,
      tipoMovimentacaoId: ((i % 6) + 1),
      setorOrigemId: ((i % 8) + 1),
      setorDestinoId: (((i + 2) % 8) + 1),
      prioridadeId: ((i % 3) + 1),
      motivoId: i % 4 === 0 ? null : ((i % 10) + 1),
      statusId: ((i % 18) + 1),
      observacao: `Observação do protocolo ${i + 1}`,
      slaPrevistoEm: new Date(baseDate + (24 - i) * 3600000).toISOString(),
      slaRealizadoEm: i % 3 === 0 ? new Date(baseDate - i * 3600000).toISOString() : null,
      slaStatus: SLA_STATUS[i % SLA_STATUS.length],
      iaRiscoAtraso: (i * 11) % 100,
      iaScoreComplexidade: (i * 13) % 100,
      iaScorePrioridade: (i * 17) % 100,
      iaRecomendacao: i % 2 === 0 ? "Priorizar análise" : "Aguardar fila padrão",
      ordemFila: i + 1,
      protocoloOrigemId: i > 5 && i % 4 === 0 ? i - 4 : null,
      ...baseAudit(),
    });
  }
  return data;
};

export const protocolosService = makeMockService<FluxodocsProtocolo>(seed);
