import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";
import { prioridadesService } from "@/services/fluxodocs/prioridades";

const config: CrudConfig<FluxodocsPrioridade> = {
  entity: "fluxodocs-prioridades",
  titlePlural: "Prioridades",
  titleSingular: "Prioridade",
  searchKey: "nome",
  tooltip: "Impacta diretamente a fila inteligente e o cálculo de SLA. Maior peso = maior prioridade.",
  service: prioridadesService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "codigo", label: "Código", type: "text", required: true, span: 1 },
    { key: "peso", label: "Peso", type: "number", required: true, span: 1, tooltip: "Maior peso = maior prioridade na fila." },
    { key: "ordem", label: "Ordem", type: "number", span: 1 },
    { key: "cor", label: "Cor", type: "color", span: 1 },
  ],
};

export default function FluxodocsPrioridadesPage() {
  return <CrudPage config={config} />;
}
