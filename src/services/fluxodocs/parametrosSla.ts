import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";

const seed = () => {
  const data: FluxodocsParametroSla[] = [];
  for (let i = 0; i < 21; i++) {
    data.push({
      id: i + 1,
      tipoDocumentoId: ((i % 10) + 1),
      setorDestinoId: ((i % 8) + 1),
      prioridadeId: ((i % 3) + 1),
      convenioId: i < 8 ? ((i % 6) + 1) : null,
      prazoHoras: [4, 8, 12, 24, 48, 72][i % 6],
      ...baseAudit(),
    });
  }
  return data;
};

export const parametrosSlaService = makeMockService<FluxodocsParametroSla>(seed);
