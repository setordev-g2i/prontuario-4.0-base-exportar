import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";
import { parametrosIaService } from "@/services/fluxodocs/parametrosIa";

const config: CrudConfig<FluxodocsParametroIa> = {
  entity: "fluxodocs-parametros-ia",
  titlePlural: "Parâmetros de IA",
  titleSingular: "Parâmetro de IA",
  searchKey: "nome",
  tooltip: "Pesos e limites usados pela IA para priorização da fila e cálculo de risco.",
  service: parametrosIaService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "chave", label: "Chave", type: "text", required: true, span: 1, tooltip: "Identificador técnico (ex.: peso_sla)." },
    { key: "valor", label: "Valor", type: "text", required: true, span: 3 },
  ],
};

export default function FluxodocsParametrosIaPage() {
  return <CrudPage config={config} />;
}
