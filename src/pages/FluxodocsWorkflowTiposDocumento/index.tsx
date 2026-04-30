import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { workflowsService } from "@/services/fluxodocs";
import { useFluxodocsOptions } from "@/lib/fluxodocs/options";
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";

export default function FluxodocsWorkflowTiposDocumentoPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsWorkflowTipoDocumento> = {
    singular: "Workflow",
    plural: "Workflows por Tipo de Documento",
    service: workflowsService,
    fields: [
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc, required: true },
      { name: "nome", label: "Nome", type: "text", required: true },
      { name: "descricao", label: "Descrição", type: "textarea" },
    ],
    listColumns: ["tipoDocumentoId", "nome", "descricao"],
    searchableFields: ["nome"],
  };

  return <FluxodocsCrudPage config={config} />;
}
