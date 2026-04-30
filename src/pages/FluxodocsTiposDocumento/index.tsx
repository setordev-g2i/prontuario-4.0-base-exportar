import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";

const config: CrudConfig<FluxodocsTipoDocumento> = {
  entity: "fluxodocs-tipos-documento",
  titlePlural: "Tipos de Documento",
  titleSingular: "Tipo de Documento",
  searchKey: "nome",
  tooltip: "Usado para workflow, SLA e validações documentais.",
  service: tiposDocumentoService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "categoria", label: "Categoria", type: "text", required: true, span: 1 },
    { key: "cor", label: "Cor", type: "color", span: 1 },
  ],
};

export default function FluxodocsTiposDocumentoPage() {
  return <CrudPage config={config} />;
}
