import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";
import { setoresService } from "@/services/fluxodocs/setores";
import { fetchUsersOptions } from "@/services/fluxodocs/externalOptions";

const config: CrudConfig<FluxodocsSetor> = {
  entity: "fluxodocs-setores",
  titlePlural: "Setores",
  titleSingular: "Setor",
  searchKey: "nome",
  tooltip: "Setores que participam do fluxo de documentos.",
  service: setoresService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "sigla", label: "Sigla", type: "text", required: true, span: 1 },
    { key: "cor", label: "Cor", type: "color", span: 1 },
    {
      key: "responsavelId",
      label: "Responsável",
      type: "select",
      span: 2,
      nullable: true,
      optionsSource: fetchUsersOptions,
      tooltip: "Usuário responsável principal pelo setor.",
    },
    {
      key: "participaFluxo",
      label: "Participa do fluxo",
      type: "boolean",
      span: 1,
      tooltip: "Se este setor pode aparecer como origem ou destino em fluxos de documentos.",
    },
  ],
};

export default function FluxodocsSetoresPage() {
  return <CrudPage config={config} />;
}
