import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";
import { aprovacoesJustificativaService } from "@/services/fluxodocs/aprovacoesJustificativa";
import { protocolosService } from "@/services/fluxodocs/protocolos";
import { protocoloItensService } from "@/services/fluxodocs/protocoloItens";
import { checklistDocumentalService } from "@/services/fluxodocs/checklistDocumental";
import { fetchUsersOptions } from "@/services/fluxodocs/externalOptions";

const STATUS = ["PENDENTE", "APROVADO", "REPROVADO", "CANCELADO"];

const config: CrudConfig<FluxodocsAprovacaoJustificativa> = {
  entity: "fluxodocs-aprovacoes-justificativa",
  titlePlural: "Aprovação de Justificativas",
  titleSingular: "Aprovação",
  searchKey: "justificativa",
  tooltip:
    "Aprovação de justificativas. Quando o checklist for JUSTIFICADO e exigir aprovação, é criada automaticamente como PENDENTE.",
  service: aprovacoesJustificativaService,
  fields: [
    { key: "checklistId", label: "Checklist", type: "select", required: true, span: 1, optionsSource: () => checklistDocumentalService.fetchOptions("id") },
    { key: "protocoloId", label: "Protocolo", type: "select", required: true, span: 1, optionsSource: () => protocolosService.fetchOptions("numero") },
    { key: "itemId", label: "Item", type: "select", required: true, span: 1, optionsSource: () => protocoloItensService.fetchOptions("id") },
    { key: "statusAprovacao", label: "Status", type: "text", required: true, span: 1, placeholder: STATUS.join(" | ") },
    { key: "solicitadoPorId", label: "Solicitado por", type: "select", span: 1, nullable: true, optionsSource: fetchUsersOptions },
    { key: "aprovadoPorId", label: "Aprovado por", type: "select", span: 1, nullable: true, optionsSource: fetchUsersOptions },
    { key: "solicitadoEm", label: "Solicitado em", type: "datetime", span: 1 },
    { key: "aprovadoEm", label: "Aprovado em", type: "datetime", span: 1 },
    { key: "justificativa", label: "Justificativa", type: "textarea", span: 3 },
    { key: "observacaoAprovador", label: "Observação do aprovador", type: "textarea", span: 3 },
  ],
};

export default function FluxodocsAprovacoesJustificativaPage() {
  return <CrudPage config={config} />;
}
