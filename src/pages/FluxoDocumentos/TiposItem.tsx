import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { tiposItemSvc } from "@/services/fluxodocs";
import type { FluxodocsTipoItem } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsTipoItem>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Tipo de item dentro de um protocolo (Conta, Atendimento, Paciente etc.)." },
  { name: "codigo", label: "Código", type: "text", required: true, inTable: true },
  { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1, inTable: true },
  { name: "descricao", label: "Descrição", type: "textarea" },
];

export default function TiposItemPage() {
  return (
    <SimpleCadastroPage
      title="Tipos de Item"
      description="Tipos de item incluídos em protocolos"
      entityLabel="Tipo de Item"
      service={tiposItemSvc}
      fields={fields}
      searchFields={["nome", "codigo"]}
    />
  );
}
