import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { statusItemService } from "@/services/fluxodocs";
import type { FluxodocsStatusItem } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsStatusItem> = {
  singular: "Status de Item",
  plural: "Status do Item",
  service: statusItemService,
  fields: [
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "ordem", label: "Ordem", type: "number", required: true },
    { name: "cor", label: "Cor", type: "color", required: true },
    { name: "finalizador", label: "Status finalizador", type: "boolean" },
  ],
  listColumns: ["codigo", "nome", "ordem", "cor"],
  searchableFields: ["nome", "codigo"],
  defaults: { ordem: 1, cor: "#3b82f6", finalizador: false },
};

export default function FluxodocsStatusItemPage() {
  return <FluxodocsCrudPage config={config} />;
}
