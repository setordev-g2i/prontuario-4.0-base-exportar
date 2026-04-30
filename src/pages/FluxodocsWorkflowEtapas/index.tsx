import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";
import { workflowEtapasService } from "@/services/fluxodocs/workflowEtapas";
import { workflowsService } from "@/services/fluxodocs/workflows";
import { statusService } from "@/services/fluxodocs/status";

const config: CrudConfig<FluxodocsWorkflowEtapa> = {
  entity: "fluxodocs-workflow-etapas",
  titlePlural: "Etapas do Workflow",
  titleSingular: "Etapa do Workflow",
  searchKey: "acao",
  tooltip:
    "Cada etapa define uma transição válida (status atual → ação → status destino) e o perfil autorizado.",
  service: workflowEtapasService,
  fields: [
    { key: "workflowId", label: "Workflow", type: "select", required: true, span: 1, optionsSource: () => workflowsService.fetchOptions("nome") },
    { key: "statusOrigemId", label: "Status Origem", type: "select", required: true, span: 1, optionsSource: () => statusService.fetchOptions("nome") },
    { key: "statusDestinoId", label: "Status Destino", type: "select", required: true, span: 1, optionsSource: () => statusService.fetchOptions("nome") },
    { key: "acao", label: "Ação", type: "text", required: true, span: 1 },
    { key: "ordem", label: "Ordem", type: "number", span: 1 },
    { key: "perfilPermitido", label: "Perfil Permitido", type: "text", span: 1, tooltip: "Perfil autorizado a executar esta etapa." },
    { key: "exigeMotivo", label: "Exige Motivo", type: "boolean", span: 1 },
    { key: "exigeObservacao", label: "Exige Observação", type: "boolean", span: 1 },
    { key: "permiteReversao", label: "Permite Reversão", type: "boolean", span: 1 },
  ],
};

export default function FluxodocsWorkflowEtapasPage() {
  return <CrudPage config={config} />;
}
