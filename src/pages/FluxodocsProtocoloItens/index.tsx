import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";
import { protocoloItensService } from "@/services/fluxodocs/protocoloItens";
import { protocolosService } from "@/services/fluxodocs/protocolos";
import { tiposItemService } from "@/services/fluxodocs/tiposItem";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";
import { statusItemService } from "@/services/fluxodocs/statusItem";
import { motivosService } from "@/services/fluxodocs/motivos";
import {
  fetchClientesOptions,
  fetchContasOptions,
  fetchAtendimentosOptions,
  fetchConveniosOptions,
} from "@/services/fluxodocs/externalOptions";

const config: CrudConfig<FluxodocsProtocoloItem> = {
  entity: "fluxodocs-protocolo-itens",
  titlePlural: "Itens de Protocolo",
  titleSingular: "Item de Protocolo",
  searchKey: "descricaoManual",
  tooltip:
    "Itens vinculados a um protocolo. Conta/Atendimento/Paciente/Convênio referenciam entidades existentes do sistema.",
  service: protocoloItensService,
  fields: [
    { key: "protocoloId", label: "Protocolo", type: "select", required: true, span: 1, optionsSource: () => protocolosService.fetchOptions("numero") },
    { key: "tipoItemId", label: "Tipo Item", type: "select", required: true, span: 1, optionsSource: () => tiposItemService.fetchOptions("nome") },
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", span: 1, nullable: true, optionsSource: () => tiposDocumentoService.fetchOptions("nome") },
    { key: "contaId", label: "Conta", type: "select", span: 1, nullable: true, optionsSource: fetchContasOptions, tooltip: "Ao selecionar, o sistema carrega atendimento, paciente e convênio." },
    { key: "atendimentoId", label: "Atendimento", type: "select", span: 1, nullable: true, optionsSource: fetchAtendimentosOptions },
    { key: "clienteId", label: "Paciente", type: "select", span: 1, nullable: true, optionsSource: fetchClientesOptions, tooltip: "Na interface é Paciente; tecnicamente usa cliente_id." },
    { key: "convenioId", label: "Convênio", type: "select", span: 1, nullable: true, optionsSource: fetchConveniosOptions, tooltip: "Preenchido automaticamente quando houver conta." },
    { key: "statusItemId", label: "Status do Item", type: "select", required: true, span: 1, optionsSource: () => statusItemService.fetchOptions("nome") },
    { key: "motivoDevolucaoId", label: "Motivo Devolução", type: "select", span: 1, nullable: true, optionsSource: () => motivosService.fetchOptions("nome") },
    { key: "iaProbabilidadeGlosa", label: "Prob. Glosa (IA)", type: "number", span: 1 },
    { key: "descricaoManual", label: "Descrição manual", type: "textarea", span: 3 },
    { key: "iaSugestaoDevolucao", label: "Sugestão IA", type: "textarea", span: 3 },
    { key: "observacao", label: "Observação", type: "textarea", span: 3 },
  ],
};

export default function FluxodocsProtocoloItensPage() {
  return <CrudPage config={config} />;
}
