import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";

const seed = () => {
  const data: FluxodocsDocumentoObrigatorioConvenio[] = [];
  for (let i = 0; i < 21; i++) {
    data.push({
      id: i + 1,
      convenioId: ((i % 10) + 1),
      tipoDocumentoId: ((i % 12) + 1),
      tipoMovimentacaoId: i % 3 === 0 ? ((i % 6) + 1) : null,
      prioridadeId: i % 4 === 0 ? ((i % 3) + 1) : null,
      obrigatorio: true,
      bloqueiaEnvio: i % 2 === 0,
      exigeJustificativaAusencia: i % 3 === 0,
      exigeAprovacaoJustificativa: i % 5 === 0,
      descricao: `Regra de documentação ${i + 1}`,
      ...baseAudit(),
    });
  }
  return data;
};

export const documentosObrigatoriosConvenioService =
  makeMockService<FluxodocsDocumentoObrigatorioConvenio>(seed);
