import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsStatusItem } from "@/types/entities/Fluxodocs";
import { statusItemService } from "@/services/fluxodocs/statusItem";

const config: CrudConfig<FluxodocsStatusItem> = {
  entity: "fluxodocs-status-item",
  titlePlural: "Status do Item",
  titleSingular: "Status do Item",
  searchKey: "nome",
  tooltip: "Status individual de cada item dentro de um protocolo.",
  service: statusItemService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "codigo", label: "Código", type: "text", required: true, span: 1 },
    { key: "ordem", label: "Ordem", type: "number", span: 1 },
    { key: "cor", label: "Cor", type: "color", span: 1 },
    { key: "finalizador", label: "Finaliza item", type: "boolean", span: 1 },
  ],
};

export default function FluxodocsStatusItemPage() {
  return <CrudPage config={config} />;
}
