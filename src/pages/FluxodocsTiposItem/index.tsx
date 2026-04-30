import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { tiposItemService } from "@/services/fluxodocs";
import type { FluxodocsTipoItem } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsTipoItem> = {
  singular: "Tipo de Item",
  plural: "Tipos de Item",
  service: tiposItemService,
  fields: [
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "nome", label: "Nome", type: "text", required: true,
      tooltip: "Use 'Paciente' (a interface usa Paciente, banco usa cliente_id)." },
    { name: "descricao", label: "Descrição", type: "textarea" },
    { name: "ordem", label: "Ordem", type: "number", required: true },
  ],
  listColumns: ["codigo", "nome", "descricao", "ordem"],
  searchableFields: ["nome", "codigo"],
  defaults: { ordem: 1 },
};

export default function FluxodocsTiposItemPage() {
  return <FluxodocsCrudPage config={config} />;
}
