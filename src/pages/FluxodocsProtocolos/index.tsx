import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { protocolosService } from "@/services/fluxodocs";
import { useFluxodocsOptions } from "@/lib/fluxodocs/options";
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";

export default function FluxodocsProtocolosPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsProtocolo> = {
    singular: "Protocolo",
    plural: "Protocolos",
    service: protocolosService,
    fields: [
      { name: "numero", label: "Número", type: "text", required: true,
        tooltip: "Número único de identificação do protocolo." },
      { name: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select",
        options: opts.tiposMov, required: true },
      { name: "setorOrigemId", label: "Setor Origem", type: "select",
        options: opts.setores, required: true },
      { name: "setorDestinoId", label: "Setor Destino", type: "select",
        options: opts.setores, required: true },
      { name: "prioridadeId", label: "Prioridade", type: "select",
        options: opts.prioridades, required: true },
      { name: "motivoId", label: "Motivo", type: "select", options: opts.motivos },
      { name: "statusId", label: "Status", type: "select",
        options: opts.status, required: true,
        tooltip: "Status atual do protocolo (gerenciado pelo workflow)." },
      { name: "observacao", label: "Observação", type: "textarea" },
      { name: "ordemFila", label: "Ordem na Fila", type: "number",
        tooltip: "Calculado pela fila inteligente (IA)." },
    ],
    listColumns: ["numero", "tipoMovimentacaoId", "setorDestinoId", "prioridadeId", "statusId"],
    searchableFields: ["numero", "observacao"],
  };

  return <FluxodocsCrudPage config={config} />;
}
