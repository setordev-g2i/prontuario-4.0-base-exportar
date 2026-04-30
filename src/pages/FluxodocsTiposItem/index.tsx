import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsTipoItem } from "@/types/entities/Fluxodocs";
import { tiposItemService } from "@/services/fluxodocs/tiposItem";

const config: CrudConfig<FluxodocsTipoItem> = {
  entity: "fluxodocs-tipos-item",
  titlePlural: "Tipos de Item",
  titleSingular: "Tipo de Item",
  searchKey: "nome",
  tooltip: "Define o tipo de item vinculado a um protocolo (Conta, Atendimento, Paciente, Documento, etc.).",
  service: tiposItemService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "codigo", label: "Código", type: "text", required: true, span: 1 },
    { key: "descricao", label: "Descrição", type: "textarea", span: 3 },
    { key: "ordem", label: "Ordem", type: "number", span: 1 },
  ],
};

export default function FluxodocsTiposItemPage() {
  return <CrudPage config={config} />;
}
