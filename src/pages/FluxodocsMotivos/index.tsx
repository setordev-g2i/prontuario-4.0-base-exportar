import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { motivosService } from "@/services/fluxodocs";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";

const TIPO_OPTIONS = [
  { id: "ENVIO", value: "Envio" },
  { id: "DEVOLUCAO", value: "Devolução" },
  { id: "CANCELAMENTO", value: "Cancelamento" },
  { id: "REENVIO", value: "Reenvio" },
  { id: "JUSTIFICATIVA", value: "Justificativa" },
];

const config: EntityConfig<FluxodocsMotivo> = {
  singular: "Motivo",
  plural: "Motivos",
  service: motivosService,
  fields: [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "tipo", label: "Tipo", type: "select", options: TIPO_OPTIONS, required: true },
  ],
  listColumns: ["nome", "tipo"],
  searchableFields: ["nome"],
  defaults: { tipo: "ENVIO" },
};

export default function FluxodocsMotivosPage() {
  return <FluxodocsCrudPage config={config} />;
}
