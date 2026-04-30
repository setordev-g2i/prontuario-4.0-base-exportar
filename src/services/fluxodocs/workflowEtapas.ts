import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";

const ACOES = ["ENVIAR","RECEBER","DEVOLVER","REENVIAR","ACEITAR","CANCELAR","JUSTIFICAR","APROVAR","REPROVAR","ARQUIVAR"];
const PERFIS = ["TODOS","FATURAMENTO","AUDITORIA","COBRANCA","DIRETORIA","RECEPCAO"];

const seed = () => {
  const data: FluxodocsWorkflowEtapa[] = [];
  for (let i = 0; i < 21; i++) {
    data.push({
      id: i + 1,
      workflowId: ((i % 10) + 1),
      statusOrigemId: ((i % 18) + 1),
      statusDestinoId: (((i + 3) % 18) + 1),
      acao: ACOES[i % ACOES.length],
      ordem: (i % 10) + 1,
      exigeMotivo: i % 3 === 0,
      exigeObservacao: i % 4 === 0,
      permiteReversao: i % 5 === 0,
      perfilPermitido: PERFIS[i % PERFIS.length],
      ...baseAudit(),
    });
  }
  return data;
};

export const workflowEtapasService = makeMockService<FluxodocsWorkflowEtapa>(seed);
