import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";

const STATUS = ["PENDENTE","ANEXADO","CONFIRMADO","JUSTIFICADO","BLOQUEANTE"];

const seed = () => {
  const data: FluxodocsChecklistDocumental[] = [];
  for (let i = 0; i < 21; i++) {
    data.push({
      id: i + 1,
      protocoloId: ((i % 10) + 1),
      itemId: ((i % 15) + 1),
      convenioId: i % 3 === 0 ? null : ((i % 8) + 1),
      tipoDocumentoId: ((i % 12) + 1),
      documentoObrigatorioId: i % 2 === 0 ? ((i % 8) + 1) : null,
      statusChecklist: STATUS[i % STATUS.length],
      documentoAnexadoId: null,
      justificativaAusencia: i % 5 === 0 ? "Documento indisponível no momento" : "",
      iaSugestao: i % 4 === 0 ? "Solicitar reenvio ao setor responsável" : "",
      iaRiscoGlosa: (i * 7) % 100,
      ...baseAudit(),
    });
  }
  return data;
};

export const checklistDocumentalService =
  makeMockService<FluxodocsChecklistDocumental>(seed);
