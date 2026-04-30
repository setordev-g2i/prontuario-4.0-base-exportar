import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string]> = [
  ["Envio", "ENVIO", "Envio de documentos entre setores"],
  ["Remessa", "REMESSA", "Remessa formal para convênio"],
  ["Devolução", "DEVOLUCAO", "Retorno do destinatário"],
  ["Reenvio", "REENVIO", "Novo envio após correção"],
  ["Movimentação Interna", "INTERNO", "Trânsito interno"],
  ["Recebimento Manual", "RECEBIMENTO_MANUAL", "Lançamento manual de recebimento"],
  ["Envio para Auditoria", "ENVIO_AUDITORIA", "Envio para análise auditorial"],
  ["Envio para Cobrança", "ENVIO_COBRANCA", "Encaminhamento para cobrança"],
  ["Envio para Recurso", "ENVIO_RECURSO", "Encaminhamento para recurso de glosa"],
  ["Envio para Diretoria", "ENVIO_DIRETORIA", "Encaminhamento para análise da diretoria"],
  ["Devolução para Origem", "DEVOLUCAO_ORIGEM", "Retorno ao setor original"],
  ["Devolução para Convênio", "DEVOLUCAO_CONVENIO", "Devolução ao convênio"],
  ["Reenvio com Anexos", "REENVIO_ANEXOS", "Reenvio incluindo novos documentos"],
  ["Reenvio Eletrônico", "REENVIO_ELETRONICO", "Reenvio por meio digital"],
  ["Movimentação para Arquivo", "ARQUIVAMENTO", "Encaminhamento ao arquivo"],
  ["Recebimento de Convênio", "RECEBIMENTO_CONVENIO", "Recebimento vindo de convênio"],
  ["Recebimento de Setor", "RECEBIMENTO_SETOR", "Recebimento entre setores"],
  ["Envio para Faturamento", "ENVIO_FATURAMENTO", "Encaminhamento ao faturamento"],
  ["Envio para Financeiro", "ENVIO_FINANCEIRO", "Encaminhamento ao financeiro"],
  ["Envio para Jurídico", "ENVIO_JURIDICO", "Encaminhamento ao jurídico"],
  ["Cancelamento de Movimento", "CANCELAMENTO", "Cancelamento de movimentação"],
];

const seed = () =>
  ITEMS.map(([nome, codigo, descricao], i) => ({
    id: i + 1,
    nome,
    codigo,
    descricao,
    ordem: i + 1,
    ...baseAudit(),
  })) as FluxodocsTipoMovimentacao[];

export const tiposMovimentacaoService = makeMockService<FluxodocsTipoMovimentacao>(seed);
