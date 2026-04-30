import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { parametrosSlaService } from "@/services/fluxodocs";
import { useFluxodocsOptions, CONVENIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";

export default function FluxodocsParametrosSlaPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsParametroSla> = {
    singular: "Parâmetro de SLA",
    plural: "Parâmetros de SLA",
    service: parametrosSlaService,
    fields: [
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc, required: true },
      { name: "setorDestinoId", label: "Setor Destino", type: "select",
        options: opts.setores },
      { name: "prioridadeId", label: "Prioridade", type: "select",
        options: opts.prioridades, required: true,
        tooltip: "Impacta diretamente a fila inteligente e SLA." },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTIONS,
        tooltip: "Opcional. SLA por convênio prevalece quando informado." },
      { name: "prazoHoras", label: "Prazo (horas)", type: "number", required: true,
        tooltip: "Prazo calculado automaticamente por regra e IA." },
    ],
    listColumns: ["tipoDocumentoId", "setorDestinoId", "prioridadeId", "convenioId", "prazoHoras"],
    defaults: { prazoHoras: 24 },
  };

  return <FluxodocsCrudPage config={config} />;
}
