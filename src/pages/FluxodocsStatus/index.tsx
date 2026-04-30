import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { statusService } from "@/services/fluxodocs";
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";

const TIPO_OPTIONS = [
  { id: "INICIAL", value: "Inicial" },
  { id: "FLUXO", value: "Fluxo" },
  { id: "EXCECAO", value: "Exceção" },
  { id: "FINAL", value: "Final" },
];

const config: EntityConfig<FluxodocsStatus> = {
  singular: "Status",
  plural: "Status do Fluxo",
  service: statusService,
  fields: [
    { name: "codigo", label: "Código", type: "text", required: true },
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "tipo", label: "Tipo", type: "select", options: TIPO_OPTIONS, required: true,
      tooltip: "Categoriza o status no workflow." },
    { name: "ordem", label: "Ordem", type: "number", required: true,
      tooltip: "Controla timeline e workflow." },
    { name: "cor", label: "Cor", type: "color", required: true },
    { name: "permiteEdicao", label: "Permite edição", type: "boolean" },
    { name: "finalizador", label: "Status finalizador", type: "boolean" },
  ],
  listColumns: ["codigo", "nome", "tipo", "ordem", "cor"],
  searchableFields: ["nome", "codigo"],
  defaults: { ordem: 1, cor: "#3b82f6", permiteEdicao: false, finalizador: false, tipo: "FLUXO" },
};

export default function FluxodocsStatusPage() {
  return <FluxodocsCrudPage config={config} />;
}
