import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { tiposDocumentoSvc } from "@/services/fluxodocs";
import { CATEGORIAS_DOCUMENTO } from "@/types/entities/fluxodocs";
import type { FluxodocsTipoDocumento } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsTipoDocumento>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Tipo de documento usado para workflow, SLA e validações." },
  { name: "categoria", label: "Categoria", type: "select", required: true, inTable: true,
    options: CATEGORIAS_DOCUMENTO.map((c) => ({ id: c, value: c })) },
  { name: "cor", label: "Cor", type: "color", required: true, defaultValue: "#3b82f6", inTable: true,
    renderCell: (r) => (
      <span className="inline-flex items-center gap-2">
        <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: r.cor }} />
        {r.cor}
      </span>
    ) },
];

export default function TiposDocumentoPage() {
  return (
    <SimpleCadastroPage
      title="Tipos de Documento"
      description="Tipos de documento que circulam entre setores"
      entityLabel="Tipo de Documento"
      service={tiposDocumentoSvc}
      fields={fields}
      searchFields={["nome", "categoria"]}
    />
  );
}
