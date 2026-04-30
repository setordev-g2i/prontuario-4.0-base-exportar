import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { regrasFluxoService } from "@/services/fluxodocs";
import { useFluxodocsOptions } from "@/lib/fluxodocs/options";
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";

export default function FluxodocsRegrasFluxoPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsRegraFluxo> = {
    singular: "Regra de Fluxo",
    plural: "Regras de Fluxo",
    service: regrasFluxoService,
    fields: [
      { name: "setorOrigemId", label: "Setor Origem", type: "select",
        options: opts.setores, required: true,
        tooltip: "Setor responsável pelo envio." },
      { name: "setorDestinoId", label: "Setor Destino", type: "select",
        options: opts.setores, required: true,
        tooltip: "Setor responsável pelo recebimento." },
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc, required: true },
      { name: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select",
        options: opts.tiposMov, required: true },
    ],
    listColumns: ["setorOrigemId", "setorDestinoId", "tipoDocumentoId", "tipoMovimentacaoId"],
  };

  return <FluxodocsCrudPage config={config} />;
}
