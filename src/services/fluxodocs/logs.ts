import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsLog } from "@/types/entities/Fluxodocs";

const ACOES = [
  "CRIADO","ENVIADO","RECEBIDO","DEVOLVIDO","ACEITO_PARCIAL","REENVIADO","CANCELADO",
  "CHECKLIST_GERADO","DOCUMENTO_ANEXADO","DOCUMENTO_CONFIRMADO","JUSTIFICATIVA_CRIADA",
  "JUSTIFICATIVA_APROVACAO_SOLICITADA","JUSTIFICATIVA_APROVADA","JUSTIFICATIVA_REPROVADA",
  "ENVIO_BLOQUEADO","IA_SLA_CALCULADA","IA_FILA_REORDENADA",
];

const seed = () => {
  const data: FluxodocsLog[] = [];
  const baseDate = Date.now();
  for (let i = 0; i < 30; i++) {
    const acao = ACOES[i % ACOES.length];
    data.push({
      id: i + 1,
      protocoloId: ((i % 10) + 1),
      usuarioId: ((i % 5) + 1),
      setorId: ((i % 8) + 1),
      acao,
      payload: JSON.stringify({ acao, sequencia: i + 1, observacao: `Log ${i + 1}` }),
      ...baseAudit(),
      created: new Date(baseDate - i * 3600000).toISOString(),
    });
  }
  return data;
};

export const logsService = makeMockService<FluxodocsLog>(seed);
