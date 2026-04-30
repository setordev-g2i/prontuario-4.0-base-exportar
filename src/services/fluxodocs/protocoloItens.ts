import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";

const seed = () => {
  const data: FluxodocsProtocoloItem[] = [];
  for (let i = 0; i < 21; i++) {
    const tipoItemId = (i % 6) + 1;
    data.push({
      id: i + 1,
      protocoloId: ((i % 10) + 1),
      tipoItemId,
      tipoDocumentoId: i % 5 === 0 ? null : ((i % 12) + 1),
      contaId: tipoItemId === 1 ? ((i % 21) + 1) : null,
      atendimentoId: tipoItemId === 2 ? ((i % 21) + 1) : null,
      clienteId: tipoItemId === 3 ? ((i % 21) + 1) : null,
      convenioId: i % 3 === 0 ? null : ((i % 8) + 1),
      descricaoManual: tipoItemId === 6 ? `Item manual ${i + 1}` : "",
      statusItemId: ((i % 9) + 1),
      motivoDevolucaoId: i % 4 === 0 ? ((i % 8) + 4) : null,
      observacao: `Observação do item ${i + 1}`,
      iaProbabilidadeGlosa: (i * 7) % 100,
      iaSugestaoDevolucao: i % 5 === 0 ? "Sugerir devolução por documentação incompleta" : "",
      ...baseAudit(),
    });
  }
  return data;
};

export const protocoloItensService = makeMockService<FluxodocsProtocoloItem>(seed);
