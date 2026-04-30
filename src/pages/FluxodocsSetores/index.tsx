import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { setoresService } from "@/services/fluxodocs";
import { USUARIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsSetor> = {
  singular: "Setor",
  plural: "Setores",
  service: setoresService,
  fields: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "sigla", label: "Sigla", type: "text", required: true },
    { name: "cor", label: "Cor", type: "color", required: true },
    { name: "responsavelId", label: "Responsável", type: "select", options: USUARIO_OPTIONS,
      tooltip: "Usuário responsável pelo setor." },
    { name: "participaFluxo", label: "Participa do fluxo", type: "boolean",
      tooltip: "Define se o setor pode aparecer em regras de fluxo." },
  ],
  listColumns: ["nome", "sigla", "cor", "responsavelId"],
  searchableFields: ["nome", "sigla"],
  defaults: { cor: "#3b82f6", participaFluxo: true },
};

export default function FluxodocsSetoresPage() {
  return <FluxodocsCrudPage config={config} />;
}
