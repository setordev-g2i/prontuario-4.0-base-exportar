import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { statusSvc } from "@/services/fluxodocs";
import { TIPOS_STATUS } from "@/types/entities/fluxodocs";
import type { FluxodocsStatus } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsStatus>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true },
  { name: "codigo", label: "Código", type: "text", required: true, inTable: true },
  { name: "tipo", label: "Tipo", type: "select", required: true, inTable: true,
    options: TIPOS_STATUS.map((t) => ({ id: t, value: t })),
    tooltip: "Categoria do status (aberto, em trânsito, fechado etc.)." },
  { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1, inTable: true,
    tooltip: "Define a sequência na timeline e no workflow." },
  { name: "cor", label: "Cor", type: "color", required: true, defaultValue: "#3b82f6" },
  { name: "permiteEdicao", label: "Permite edição neste status", type: "switch", defaultValue: true },
  { name: "finalizador", label: "Status finalizador", type: "switch", defaultValue: false,
    tooltip: "Quando ativo, encerra o fluxo do protocolo." },
];

export default function StatusPage() {
  return (
    <SimpleCadastroPage
      title="Status do Fluxo"
      description="Status de protocolo do fluxo de documentos"
      entityLabel="Status"
      service={statusSvc}
      fields={fields}
      searchFields={["nome", "codigo"]}
    />
  );
}
