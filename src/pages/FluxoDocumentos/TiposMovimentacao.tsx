import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { tiposMovimentacaoSvc } from "@/services/fluxodocs";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsTipoMovimentacao>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Define o tipo de fluxo entre setores." },
  { name: "codigo", label: "Código", type: "text", required: true, inTable: true,
    tooltip: "Identificador técnico (ex: ENVIO, DEVOLUCAO)." },
  { name: "ordem", label: "Ordem", type: "number", required: true, inTable: true, defaultValue: 1 },
  { name: "descricao", label: "Descrição", type: "textarea" },
];

export default function TiposMovimentacaoPage() {
  return (
    <SimpleCadastroPage
      title="Tipos de Movimentação"
      description="Tipos de movimentação entre setores"
      entityLabel="Tipo de Movimentação"
      service={tiposMovimentacaoSvc}
      fields={fields}
      searchFields={["nome", "codigo"]}
    />
  );
}
