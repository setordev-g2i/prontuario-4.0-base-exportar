import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";

const seed = () => {
  const data: FluxodocsRegraFluxo[] = [];
  let id = 1;
  // Gera 21 combinações realistas
  const combos: Array<[number, number, number, number]> = [
    [1, 4, 1, 1], [1, 5, 1, 1], [4, 1, 1, 3], [5, 1, 1, 3],
    [4, 6, 1, 8], [5, 6, 1, 8], [6, 7, 1, 19], [7, 6, 1, 11],
    [3, 4, 2, 1], [3, 5, 2, 1], [1, 8, 2, 9], [8, 1, 2, 11],
    [4, 5, 3, 7], [5, 4, 3, 7], [1, 4, 4, 13], [4, 1, 4, 14],
    [6, 4, 5, 11], [7, 4, 5, 11], [1, 18, 6, 10], [18, 1, 6, 11],
    [2, 1, 7, 5],
  ];
  for (const [orig, dest, td, tm] of combos) {
    data.push({
      id: id++,
      setorOrigemId: orig,
      setorDestinoId: dest,
      tipoDocumentoId: td,
      tipoMovimentacaoId: tm,
      ...baseAudit(),
    });
  }
  return data;
};

export const regrasFluxoService = makeMockService<FluxodocsRegraFluxo>(seed);
