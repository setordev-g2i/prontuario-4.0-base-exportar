import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/Fluxodocs";
import { tiposMovimentacaoService } from "@/services/fluxodocs/tiposMovimentacao";

const config: CrudConfig<FluxodocsTipoMovimentacao> = {
  entity: "fluxodocs-tipos-movimentacao",
  titlePlural: "Tipos de Movimentação",
  titleSingular: "Tipo de Movimentação",
  searchKey: "nome",
  tooltip: "Define o tipo de fluxo entre setores (envio, remessa, devolução, etc.).",
  service: tiposMovimentacaoService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "codigo", label: "Código", type: "text", required: true, span: 1 },
    { key: "descricao", label: "Descrição", type: "textarea", span: 3 },
    { key: "ordem", label: "Ordem", type: "number", span: 1 },
  ],
};

export default function FluxodocsTiposMovimentacaoPage() {
  return <CrudPage config={config} />;
}
