import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";
import { protocolosService } from "@/services/fluxodocs/protocolos";
import { tiposMovimentacaoService } from "@/services/fluxodocs/tiposMovimentacao";
import { setoresService } from "@/services/fluxodocs/setores";
import { prioridadesService } from "@/services/fluxodocs/prioridades";
import { motivosService } from "@/services/fluxodocs/motivos";
import { statusService } from "@/services/fluxodocs/status";

const config: CrudConfig<FluxodocsProtocolo> = {
  entity: "fluxodocs-protocolos",
  titlePlural: "Protocolos",
  titleSingular: "Protocolo",
  searchKey: "numero",
  tooltip:
    "Cadastro administrativo de protocolos. A criação operacional completa será feita na Etapa 2.",
  service: protocolosService,
  fields: [
    { key: "numero", label: "Número", type: "text", required: true, span: 1 },
    { key: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select", required: true, span: 1, optionsSource: () => tiposMovimentacaoService.fetchOptions("nome"), tooltip: "Define o tipo de fluxo entre setores." },
    { key: "statusId", label: "Status", type: "select", required: true, span: 1, optionsSource: () => statusService.fetchOptions("nome") },
    { key: "setorOrigemId", label: "Setor Origem", type: "select", required: true, span: 1, optionsSource: () => setoresService.fetchOptions("nome") },
    { key: "setorDestinoId", label: "Setor Destino", type: "select", required: true, span: 1, optionsSource: () => setoresService.fetchOptions("nome") },
    { key: "prioridadeId", label: "Prioridade", type: "select", required: true, span: 1, optionsSource: () => prioridadesService.fetchOptions("nome"), tooltip: "Impacta fila inteligente e SLA." },
    { key: "motivoId", label: "Motivo", type: "select", span: 1, nullable: true, optionsSource: () => motivosService.fetchOptions("nome") },
    { key: "protocoloOrigemId", label: "Protocolo Origem", type: "select", span: 1, nullable: true, optionsSource: () => protocolosService.fetchOptions("numero") },
    { key: "ordemFila", label: "Ordem na Fila", type: "number", span: 1 },
    { key: "slaPrevistoEm", label: "SLA Previsto", type: "datetime", span: 1, tooltip: "Prazo calculado automaticamente." },
    { key: "slaRealizadoEm", label: "SLA Realizado", type: "datetime", span: 1 },
    { key: "slaStatus", label: "Status SLA", type: "text", span: 1, placeholder: "NO_PRAZO | ALERTA | ESTOURADO | CONCLUIDO" },
    { key: "iaRiscoAtraso", label: "Risco Atraso (IA)", type: "number", span: 1 },
    { key: "iaScoreComplexidade", label: "Score Complexidade", type: "number", span: 1 },
    { key: "iaScorePrioridade", label: "Score Prioridade", type: "number", span: 1 },
    { key: "iaRecomendacao", label: "Recomendação IA", type: "textarea", span: 3 },
    { key: "observacao", label: "Observação", type: "textarea", span: 3 },
  ],
};

export default function FluxodocsProtocolosPage() {
  return <CrudPage config={config} />;
}
