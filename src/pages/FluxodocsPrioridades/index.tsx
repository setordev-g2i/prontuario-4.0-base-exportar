import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { prioridadesService } from "@/services/fluxodocs";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsPrioridade> = {
  singular: "Prioridade",
  plural: "Prioridades",
  service: prioridadesService,
  fields: [
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "peso", label: "Peso", type: "number", required: true,
      tooltip: "Maior peso = maior prioridade na fila inteligente." },
    { name: "cor", label: "Cor", type: "color", required: true },
    { name: "ordem", label: "Ordem", type: "number", required: true },
  ],
  listColumns: ["codigo", "nome", "peso", "cor", "ordem"],
  searchableFields: ["nome", "codigo"],
  defaults: { peso: 1, cor: "#3b82f6", ordem: 1 },
};

export default function FluxodocsPrioridadesPage() {
  return <FluxodocsCrudPage config={config} />;
}
