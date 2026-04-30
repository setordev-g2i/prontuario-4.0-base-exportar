import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";
import { checklistDocumentalService } from "@/services/fluxodocs/checklistDocumental";
import { protocolosService } from "@/services/fluxodocs/protocolos";
import { protocoloItensService } from "@/services/fluxodocs/protocoloItens";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";
import { documentosObrigatoriosConvenioService } from "@/services/fluxodocs/documentosObrigatoriosConvenio";
import { fetchConveniosOptions } from "@/services/fluxodocs/externalOptions";

const STATUS = ["PENDENTE", "ANEXADO", "CONFIRMADO", "JUSTIFICADO", "BLOQUEANTE"];

const config: CrudConfig<FluxodocsChecklistDocumental> = {
  entity: "fluxodocs-checklist-documental",
  titlePlural: "Checklist Documental",
  titleSingular: "Checklist",
  searchKey: "id",
  tooltip:
    "Documentos exigidos por protocolo/item. Permite Anexar, Confirmar (já no sistema) ou Justificar a ausência.",
  service: checklistDocumentalService,
  fields: [
    { key: "protocoloId", label: "Protocolo", type: "select", required: true, span: 1, optionsSource: () => protocolosService.fetchOptions("numero") },
    { key: "itemId", label: "Item", type: "select", required: true, span: 1, optionsSource: () => protocoloItensService.fetchOptions("id") },
    { key: "convenioId", label: "Convênio", type: "select", span: 1, nullable: true, optionsSource: fetchConveniosOptions },
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", required: true, span: 1, optionsSource: () => tiposDocumentoService.fetchOptions("nome") },
    { key: "documentoObrigatorioId", label: "Doc. Obrigatório", type: "select", span: 1, nullable: true, optionsSource: () => documentosObrigatoriosConvenioService.fetchOptions("descricao") },
    {
      key: "statusChecklist",
      label: "Status",
      type: "select",
      required: true,
      span: 1,
      optionsSource: async () => STATUS.map((s, i) => ({ id: i + 1, value: s })),
      formatList: (v) => String(v ?? "—"),
    },
    { key: "justificativaAusencia", label: "Justificativa", type: "textarea", span: 3, tooltip: "Use quando o documento não será anexado." },
    { key: "iaSugestao", label: "Sugestão IA", type: "textarea", span: 3 },
    { key: "iaRiscoGlosa", label: "Risco Glosa (%)", type: "number", span: 1 },
  ],
};

// Override: status é texto livre (não FK numérica)
const fixedConfig: CrudConfig<FluxodocsChecklistDocumental> = {
  ...config,
  fields: config.fields.map((f) =>
    f.key === "statusChecklist"
      ? { ...f, type: "text" as const, optionsSource: undefined, placeholder: STATUS.join(" | ") }
      : f,
  ),
};

export default function FluxodocsChecklistDocumentalPage() {
  return <CrudPage config={fixedConfig} />;
}
