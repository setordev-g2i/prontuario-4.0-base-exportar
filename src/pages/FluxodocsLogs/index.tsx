/**
 * Logs do módulo — apenas consulta. Form de cadastro fica oculto na prática
 * (logs são gerados por ações operacionais), mas mantemos o CrudPage padrão
 * para visualização/filtros.
 */
import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { logsService } from "@/services/fluxodocs";
import { useFluxodocsOptions, USUARIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsLog } from "@/types/entities/Fluxodocs";

export default function FluxodocsLogsPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsLog> = {
    singular: "Log",
    plural: "Logs de Auditoria",
    service: logsService,
    fields: [
      { name: "protocoloId", label: "Protocolo (ID)", type: "number" },
      { name: "usuarioId", label: "Usuário", type: "select", options: USUARIO_OPTIONS },
      { name: "setorId", label: "Setor", type: "select", options: opts.setores },
      { name: "acao", label: "Ação", type: "text", required: true },
      { name: "payload", label: "Payload", type: "textarea",
        tooltip: "Conteúdo serializado da ação (JSON)." },
    ],
    listColumns: ["acao", "protocoloId", "usuarioId", "setorId"],
    searchableFields: ["acao", "payload"],
  };

  return <FluxodocsCrudPage config={config} />;
}
