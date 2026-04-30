import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { statusItemSvc } from "@/services/fluxodocs";
import type { FluxodocsStatusItem } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsStatusItem>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true },
  { name: "codigo", label: "Código", type: "text", required: true, inTable: true },
  { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1, inTable: true },
  { name: "cor", label: "Cor", type: "color", required: true, defaultValue: "#3b82f6" },
  { name: "finalizador", label: "Status finalizador", type: "switch", defaultValue: false,
    tooltip: "Quando ativo, indica que o item foi concluído." },
];

export default function StatusItemPage() {
  return (
    <SimpleCadastroPage
      title="Status do Item"
      description="Status aplicáveis a itens de protocolo"
      entityLabel="Status do Item"
      service={statusItemSvc}
      fields={fields}
      searchFields={["nome", "codigo"]}
    />
  );
}
