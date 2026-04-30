import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string]> = [
  ["Envio de remessa de faturamento", "ENVIO"],
  ["Envio para auditoria de convênio", "ENVIO"],
  ["Envio para análise interna", "ENVIO"],
  ["Devolução por documentação incompleta", "DEVOLUCAO"],
  ["Devolução por inconsistência de guia", "DEVOLUCAO"],
  ["Devolução por divergência de valor", "DEVOLUCAO"],
  ["Devolução por glosa", "DEVOLUCAO"],
  ["Devolução por falta de autorização", "DEVOLUCAO"],
  ["Cancelamento por solicitação", "CANCELAMENTO"],
  ["Cancelamento por duplicidade", "CANCELAMENTO"],
  ["Reenvio após correção", "REENVIO"],
  ["Reenvio após complemento", "REENVIO"],
  ["Justificativa de ausência de documento", "JUSTIFICATIVA"],
  ["Justificativa de atraso", "JUSTIFICATIVA"],
  ["Justificativa de retorno", "JUSTIFICATIVA"],
  ["Devolução por código de procedimento", "DEVOLUCAO"],
  ["Devolução por dados do paciente", "DEVOLUCAO"],
  ["Cancelamento administrativo", "CANCELAMENTO"],
  ["Reenvio por solicitação do convênio", "REENVIO"],
  ["Justificativa de exceção contratual", "JUSTIFICATIVA"],
  ["Envio para diretoria", "ENVIO"],
];

const seed = () =>
  ITEMS.map(([nome, tipo], i) => ({
    id: i + 1,
    nome,
    tipo,
    ...baseAudit(),
  })) as FluxodocsMotivo[];

export const motivosService = makeMockService<FluxodocsMotivo>(seed);
