import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { checklistService } from "@/services/fluxodocs";
import { useFluxodocsOptions, CONVENIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";

const STATUS_CHECKLIST = [
  { id: "PENDENTE", value: "Pendente" },
  { id: "ANEXADO", value: "Anexado" },
  { id: "CONFIRMADO", value: "Confirmado" },
  { id: "JUSTIFICADO", value: "Justificado" },
  { id: "BLOQUEANTE", value: "Bloqueante" },
];

export default function FluxodocsChecklistDocumentalPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsChecklistDocumental> = {
    singular: "Item de Checklist",
    plural: "Checklist Documental",
    service: checklistService,
    fields: [
      { name: "protocoloId", label: "Protocolo (ID)", type: "number", required: true },
      { name: "itemId", label: "Item (ID)", type: "number" },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTIONS },
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc, required: true },
      { name: "documentoObrigatorioId", label: "Doc. Obrigatório (ID)", type: "number" },
      { name: "statusChecklist", label: "Status", type: "select",
        options: STATUS_CHECKLIST, required: true,
        tooltip: "Documentos exigidos conforme convênio e regras." },
      { name: "documentoAnexadoId", label: "Documento anexado (ID)", type: "number" },
      { name: "justificativaAusencia", label: "Justificativa", type: "textarea",
        tooltip: "Use quando o documento não será anexado." },
      { name: "iaSugestao", label: "Sugestão IA", type: "textarea" },
      { name: "iaRiscoGlosa", label: "Risco de glosa (IA)", type: "number" },
    ],
    listColumns: ["protocoloId", "tipoDocumentoId", "convenioId", "statusChecklist"],
    defaults: { statusChecklist: "PENDENTE" },
  };

  return <FluxodocsCrudPage config={config} />;
}
