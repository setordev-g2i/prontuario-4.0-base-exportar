import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";
import { regrasFluxoService } from "@/services/fluxodocs/regrasFluxo";
import { setoresService } from "@/services/fluxodocs/setores";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";
import { tiposMovimentacaoService } from "@/services/fluxodocs/tiposMovimentacao";

const setorOpts = () => setoresService.fetchOptions("nome");
const tdOpts = () => tiposDocumentoService.fetchOptions("nome");
const tmOpts = () => tiposMovimentacaoService.fetchOptions("nome");

const config: CrudConfig<FluxodocsRegraFluxo> = {
  entity: "fluxodocs-regras-fluxo",
  titlePlural: "Regras de Fluxo",
  titleSingular: "Regra de Fluxo",
  searchKey: "id",
  tooltip:
    "Define se a combinação setor origem + setor destino + tipo documento + tipo movimentação é permitida. Se não houver regra ativa, o envio será bloqueado.",
  service: regrasFluxoService,
  fields: [
    { key: "setorOrigemId", label: "Setor Origem", type: "select", required: true, span: 1, optionsSource: setorOpts, tooltip: "Setor responsável pelo envio." },
    { key: "setorDestinoId", label: "Setor Destino", type: "select", required: true, span: 1, optionsSource: setorOpts, tooltip: "Setor responsável pelo recebimento." },
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", required: true, span: 1, optionsSource: tdOpts },
    { key: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select", required: true, span: 1, optionsSource: tmOpts, tooltip: "Tipo de fluxo entre setores." },
  ],
};

export default function FluxodocsRegrasFluxoPage() {
  return <CrudPage config={config} />;
}
