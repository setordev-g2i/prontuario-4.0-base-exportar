/**
 * Instâncias dos services para todas as 19 entidades fluxodocs_*.
 * Cada um usa createFluxodocsService com o endpoint REST correspondente
 * e o seed de mock apropriado.
 */
import { createFluxodocsService } from "@/lib/fluxodocs/createService";
import * as seeds from "@/lib/fluxodocs/seeds";
import type {
  FluxodocsTipoMovimentacao, FluxodocsPrioridade, FluxodocsStatus,
  FluxodocsTipoItem, FluxodocsStatusItem, FluxodocsSetor,
  FluxodocsTipoDocumento, FluxodocsMotivo, FluxodocsRegraFluxo,
  FluxodocsParametroSla, FluxodocsParametroIa,
  FluxodocsWorkflowTipoDocumento, FluxodocsWorkflowEtapa,
  FluxodocsDocumentoObrigatorioConvenio, FluxodocsChecklistDocumental,
  FluxodocsAprovacaoJustificativa, FluxodocsProtocolo,
  FluxodocsProtocoloItem, FluxodocsLog,
} from "@/types/entities/Fluxodocs";

export const tiposMovimentacaoService = createFluxodocsService<FluxodocsTipoMovimentacao>(
  "/fluxodocs/tipos-movimentacao", seeds.seedTiposMovimentacao);
export const prioridadesService = createFluxodocsService<FluxodocsPrioridade>(
  "/fluxodocs/prioridades", seeds.seedPrioridades);
export const statusService = createFluxodocsService<FluxodocsStatus>(
  "/fluxodocs/status", seeds.seedStatus);
export const tiposItemService = createFluxodocsService<FluxodocsTipoItem>(
  "/fluxodocs/tipos-item", seeds.seedTiposItem);
export const statusItemService = createFluxodocsService<FluxodocsStatusItem>(
  "/fluxodocs/status-item", seeds.seedStatusItem);
export const setoresService = createFluxodocsService<FluxodocsSetor>(
  "/fluxodocs/setores", seeds.seedSetores);
export const tiposDocumentoService = createFluxodocsService<FluxodocsTipoDocumento>(
  "/fluxodocs/tipos-documento", seeds.seedTiposDocumento);
export const motivosService = createFluxodocsService<FluxodocsMotivo>(
  "/fluxodocs/motivos", seeds.seedMotivos);
export const regrasFluxoService = createFluxodocsService<FluxodocsRegraFluxo>(
  "/fluxodocs/regras-fluxo", seeds.seedRegrasFluxo);
export const parametrosSlaService = createFluxodocsService<FluxodocsParametroSla>(
  "/fluxodocs/parametros-sla", seeds.seedParametrosSla);
export const parametrosIaService = createFluxodocsService<FluxodocsParametroIa>(
  "/fluxodocs/parametros-ia", seeds.seedParametrosIa);
export const workflowsService = createFluxodocsService<FluxodocsWorkflowTipoDocumento>(
  "/fluxodocs/workflows", seeds.seedWorkflows);
export const workflowEtapasService = createFluxodocsService<FluxodocsWorkflowEtapa>(
  "/fluxodocs/workflow-etapas", seeds.seedWorkflowEtapas);
export const documentosObrigatoriosConvenioService =
  createFluxodocsService<FluxodocsDocumentoObrigatorioConvenio>(
    "/fluxodocs/documentos-obrigatorios-convenio",
    seeds.seedDocumentosObrigatoriosConvenio);
export const checklistService = createFluxodocsService<FluxodocsChecklistDocumental>(
  "/fluxodocs/checklist", seeds.seedChecklist);
export const aprovacoesService = createFluxodocsService<FluxodocsAprovacaoJustificativa>(
  "/fluxodocs/aprovacoes", seeds.seedAprovacoes);
export const protocolosService = createFluxodocsService<FluxodocsProtocolo>(
  "/fluxodocs/protocolos", seeds.seedProtocolos);
export const protocoloItensService = createFluxodocsService<FluxodocsProtocoloItem>(
  "/fluxodocs/protocolo-itens", seeds.seedProtocoloItens);
export const logsService = createFluxodocsService<FluxodocsLog>(
  "/fluxodocs/logs", seeds.seedLogs);
