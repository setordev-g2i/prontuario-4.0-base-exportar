import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { tiposMovimentacaoService } from "@/services/fluxodocs";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsTipoMovimentacao> = {
  singular: "Tipo de Movimentação",
  plural: "Tipos de Movimentação",
  service: tiposMovimentacaoService,
  fields: [
    { name: "codigo", label: "Código", type: "text", required: true,
      tooltip: "Identificador único do tipo de movimentação." },
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "descricao", label: "Descrição", type: "textarea",
      tooltip: "Define o tipo de fluxo entre setores." },
    { name: "ordem", label: "Ordem", type: "number", required: true },
  ],
  listColumns: ["codigo", "nome", "descricao", "ordem"],
  searchableFields: ["nome", "codigo", "descricao"],
  defaults: { ordem: 1 },
};

export default function FluxodocsTiposMovimentacaoPage() {
  return <FluxodocsCrudPage config={config} />;
}
