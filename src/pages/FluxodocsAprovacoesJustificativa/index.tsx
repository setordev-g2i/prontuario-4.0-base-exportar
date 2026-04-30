import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { aprovacoesService } from "@/services/fluxodocs";
import { USUARIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";

const STATUS_APROVACAO = [
  { id: "PENDENTE", value: "Pendente" },
  { id: "APROVADO", value: "Aprovado" },
  { id: "REPROVADO", value: "Reprovado" },
  { id: "CANCELADO", value: "Cancelado" },
];

const config: EntityConfig<FluxodocsAprovacaoJustificativa> = {
  singular: "Aprovação de Justificativa",
  plural: "Aprovações de Justificativa",
  service: aprovacoesService,
  fields: [
    { name: "checklistId", label: "Checklist (ID)", type: "number", required: true },
    { name: "protocoloId", label: "Protocolo (ID)", type: "number", required: true },
    { name: "itemId", label: "Item (ID)", type: "number" },
    { name: "justificativa", label: "Justificativa", type: "textarea", required: true },
    { name: "statusAprovacao", label: "Status", type: "select",
      options: STATUS_APROVACAO, required: true },
    { name: "solicitadoPorId", label: "Solicitado por", type: "select",
      options: USUARIO_OPTIONS, required: true },
    { name: "solicitadoEm", label: "Solicitado em", type: "date" },
    { name: "aprovadoPorId", label: "Aprovado por", type: "select", options: USUARIO_OPTIONS },
    { name: "aprovadoEm", label: "Aprovado em", type: "date" },
    { name: "observacaoAprovador", label: "Observação do aprovador", type: "textarea" },
  ],
  listColumns: ["protocoloId", "checklistId", "statusAprovacao", "solicitadoPorId"],
  defaults: { statusAprovacao: "PENDENTE", solicitadoPorId: 1 },
};

export default function FluxodocsAprovacoesJustificativaPage() {
  return <FluxodocsCrudPage config={config} />;
}
