import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { setoresSvc } from "@/services/fluxodocs";
import type { FluxodocsSetor } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsSetor>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Nome do setor responsável pelo envio ou recebimento." },
  { name: "sigla", label: "Sigla", type: "text", required: true, inTable: true,
    tooltip: "Abreviação curta usada em listas e relatórios." },
  { name: "cor", label: "Cor", type: "color", required: true, defaultValue: "#3b82f6",
    inTable: true,
    renderCell: (r) => (
      <span className="inline-flex items-center gap-2">
        <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: r.cor }} />
        {r.cor}
      </span>
    ) },
  { name: "responsavelId", label: "Responsável (ID do usuário)", type: "number",
    tooltip: "ID do usuário responsável pelo setor (vínculo com users)." },
  { name: "participaFluxo", label: "Participa do Fluxo", type: "switch", defaultValue: true,
    tooltip: "Se ativo, o setor aparece como origem/destino nos fluxos." },
];

export default function SetoresPage() {
  return (
    <SimpleCadastroPage
      title="Setores"
      description="Setores que participam dos fluxos de documentos"
      entityLabel="Setor"
      service={setoresSvc}
      fields={fields}
      searchFields={["nome", "sigla"]}
    />
  );
}
