import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";
import { workflowsService } from "@/services/fluxodocs/workflows";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";

const config: CrudConfig<FluxodocsWorkflowTipoDocumento> = {
  entity: "fluxodocs-workflows-tipos-documento",
  titlePlural: "Workflow por Tipo de Documento",
  titleSingular: "Workflow",
  searchKey: "nome",
  tooltip: "Define o workflow associado a cada tipo de documento.",
  service: workflowsService,
  fields: [
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", required: true, span: 1, optionsSource: () => tiposDocumentoService.fetchOptions("nome") },
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "descricao", label: "Descrição", type: "textarea", span: 3 },
  ],
};

export default function FluxodocsWorkflowTiposDocumentoPage() {
  return <CrudPage config={config} />;
}
