import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { parametrosIaService } from "@/services/fluxodocs";
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";

const config: EntityConfig<FluxodocsParametroIa> = {
  singular: "Parâmetro de IA",
  plural: "Parâmetros de IA",
  service: parametrosIaService,
  fields: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "chave", label: "Chave", type: "text", required: true,
      tooltip: "Identificador técnico utilizado pela IA (ex.: peso_prioridade)." },
    { name: "valor", label: "Valor", type: "text", required: true,
      tooltip: "Valor numérico ou textual interpretado pela IA." },
  ],
  listColumns: ["nome", "chave", "valor"],
  searchableFields: ["nome", "chave"],
};

export default function FluxodocsParametrosIaPage() {
  return <FluxodocsCrudPage config={config} />;
}
