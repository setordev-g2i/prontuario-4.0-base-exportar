import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";

const STATUS = ["PENDENTE","APROVADO","REPROVADO","CANCELADO"];

const seed = () => {
  const data: FluxodocsAprovacaoJustificativa[] = [];
  const baseDate = Date.now();
  for (let i = 0; i < 21; i++) {
    const status = STATUS[i % STATUS.length];
    data.push({
      id: i + 1,
      checklistId: ((i % 21) + 1),
      protocoloId: ((i % 10) + 1),
      itemId: ((i % 15) + 1),
      justificativa: `Justificativa #${i + 1}: documento será enviado posteriormente.`,
      statusAprovacao: status,
      solicitadoPorId: ((i % 5) + 1),
      solicitadoEm: new Date(baseDate - i * 86400000).toISOString(),
      aprovadoPorId: status === "PENDENTE" ? null : ((i % 3) + 1),
      aprovadoEm: status === "PENDENTE" ? null : new Date(baseDate - i * 43200000).toISOString(),
      observacaoAprovador: status === "REPROVADO" ? "Anexar documento original" : "",
      ...baseAudit(),
    });
  }
  return data;
};

export const aprovacoesJustificativaService =
  makeMockService<FluxodocsAprovacaoJustificativa>(seed);
