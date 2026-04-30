import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";
import { parametrosSlaService } from "@/services/fluxodocs/parametrosSla";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";
import { setoresService } from "@/services/fluxodocs/setores";
import { prioridadesService } from "@/services/fluxodocs/prioridades";
import { fetchConveniosOptions } from "@/services/fluxodocs/externalOptions";

const config: CrudConfig<FluxodocsParametroSla> = {
  entity: "fluxodocs-parametros-sla",
  titlePlural: "Parâmetros de SLA",
  titleSingular: "Parâmetro de SLA",
  searchKey: "id",
  tooltip:
    "Prazo calculado automaticamente. Ordem de busca: convênio + tipo + setor + prioridade → tipo + setor + prioridade → tipo + prioridade → prioridade.",
  service: parametrosSlaService,
  fields: [
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", span: 1, nullable: true, optionsSource: () => tiposDocumentoService.fetchOptions("nome") },
    { key: "setorDestinoId", label: "Setor Destino", type: "select", span: 1, nullable: true, optionsSource: () => setoresService.fetchOptions("nome") },
    { key: "prioridadeId", label: "Prioridade", type: "select", span: 1, nullable: true, optionsSource: () => prioridadesService.fetchOptions("nome"), tooltip: "Impacta cálculo do prazo." },
    { key: "convenioId", label: "Convênio", type: "select", span: 1, nullable: true, optionsSource: fetchConveniosOptions, tooltip: "Opcional. Se informado, prevalece sobre as demais regras." },
    { key: "prazoHoras", label: "Prazo (horas)", type: "number", required: true, span: 1 },
  ],
};

export default function FluxodocsParametrosSlaPage() {
  return <CrudPage config={config} />;
}
