import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { tiposDocumentoService } from "@/services/fluxodocs";
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";

const CATEGORIA_OPTIONS = [
  { id: "FATURAMENTO", value: "Faturamento" },
  { id: "CLINICO", value: "Clínico" },
  { id: "ADMINISTRATIVO", value: "Administrativo" },
];

const config: EntityConfig<FluxodocsTipoDocumento> = {
  singular: "Tipo de Documento",
  plural: "Tipos de Documento",
  service: tiposDocumentoService,
  fields: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "categoria", label: "Categoria", type: "select", options: CATEGORIA_OPTIONS, required: true,
      tooltip: "Usado para workflow, SLA e validações." },
    { name: "cor", label: "Cor", type: "color", required: true },
  ],
  listColumns: ["nome", "categoria", "cor"],
  searchableFields: ["nome"],
  defaults: { categoria: "ADMINISTRATIVO", cor: "#3b82f6" },
};

export default function FluxodocsTiposDocumentoPage() {
  return <FluxodocsCrudPage config={config} />;
}
