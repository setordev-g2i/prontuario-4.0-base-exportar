import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { workflowEtapasService } from "@/services/fluxodocs";
import { useFluxodocsOptions } from "@/lib/fluxodocs/options";
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";

const PERFIL_OPTIONS = [
  { id: "TODOS", value: "Todos" },
  { id: "AUDITOR", value: "Auditor" },
  { id: "FATURISTA", value: "Faturista" },
  { id: "GESTOR", value: "Gestor" },
];

export default function FluxodocsWorkflowEtapasPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsWorkflowEtapa> = {
    singular: "Etapa do Workflow",
    plural: "Etapas do Workflow",
    service: workflowEtapasService,
    fields: [
      { name: "workflowId", label: "Workflow", type: "select",
        options: opts.workflows, required: true },
      { name: "statusOrigemId", label: "Status Origem", type: "select",
        options: opts.status, required: true },
      { name: "statusDestinoId", label: "Status Destino", type: "select",
        options: opts.status, required: true },
      { name: "acao", label: "Ação", type: "text", required: true,
        tooltip: "Ex.: ENVIAR, RECEBER, DEVOLVER." },
      { name: "ordem", label: "Ordem", type: "number", required: true },
      { name: "exigeMotivo", label: "Exige motivo", type: "boolean" },
      { name: "exigeObservacao", label: "Exige observação", type: "boolean" },
      { name: "permiteReversao", label: "Permite reversão", type: "boolean" },
      { name: "perfilPermitido", label: "Perfil permitido", type: "select",
        options: PERFIL_OPTIONS, required: true,
        tooltip: "Perfil que pode executar essa etapa." },
    ],
    listColumns: ["workflowId", "acao", "statusOrigemId", "statusDestinoId", "ordem"],
    searchableFields: ["acao"],
    defaults: { ordem: 1, perfilPermitido: "TODOS", exigeMotivo: false, exigeObservacao: false, permiteReversao: false },
  };

  return <FluxodocsCrudPage config={config} />;
}
