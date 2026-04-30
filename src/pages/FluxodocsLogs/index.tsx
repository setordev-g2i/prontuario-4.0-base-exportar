import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsLog } from "@/types/entities/Fluxodocs";
import { logsService } from "@/services/fluxodocs/logs";
import { protocolosService } from "@/services/fluxodocs/protocolos";
import { setoresService } from "@/services/fluxodocs/setores";
import { fetchUsersOptions } from "@/services/fluxodocs/externalOptions";

const config: CrudConfig<FluxodocsLog> = {
  entity: "fluxodocs-logs",
  titlePlural: "Logs",
  titleSingular: "Log",
  searchKey: "acao",
  tooltip: "Registro de auditoria. Apenas para consulta.",
  service: logsService,
  fields: [
    { key: "protocoloId", label: "Protocolo", type: "select", span: 1, nullable: true, optionsSource: () => protocolosService.fetchOptions("numero") },
    { key: "usuarioId", label: "Usuário", type: "select", span: 1, nullable: true, optionsSource: fetchUsersOptions },
    { key: "setorId", label: "Setor", type: "select", span: 1, nullable: true, optionsSource: () => setoresService.fetchOptions("nome") },
    { key: "acao", label: "Ação", type: "text", required: true, span: 1 },
    {
      key: "payload",
      label: "Payload",
      type: "textarea",
      span: 3,
      tooltip: "Dados em JSON associados à ação.",
      formatList: (v) => {
        const s = String(v ?? "");
        return s.length > 60 ? s.slice(0, 60) + "..." : s;
      },
    },
  ],
};

export default function FluxodocsLogsPage() {
  return <CrudPage config={config} />;
}
