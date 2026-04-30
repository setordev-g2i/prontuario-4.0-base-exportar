import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { protocoloItensService } from "@/services/fluxodocs";
import {
  useFluxodocsOptions, CONVENIO_OPTIONS, PACIENTE_OPTIONS,
  CONTA_OPTIONS, ATENDIMENTO_OPTIONS,
} from "@/lib/fluxodocs/options";
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";

export default function FluxodocsProtocoloItensPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsProtocoloItem> = {
    singular: "Item de Protocolo",
    plural: "Itens de Protocolo",
    service: protocoloItensService,
    fields: [
      { name: "protocoloId", label: "Protocolo (ID)", type: "number", required: true,
        tooltip: "Vincule ao número do protocolo (fluxo)." },
      { name: "tipoItemId", label: "Tipo Item", type: "select",
        options: opts.tiposItem, required: true },
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc },
      { name: "contaId", label: "Conta", type: "select", options: CONTA_OPTIONS,
        tooltip: "Ao selecionar, o sistema carrega atendimento, paciente e convênio." },
      { name: "atendimentoId", label: "Atendimento", type: "select", options: ATENDIMENTO_OPTIONS },
      { name: "clienteId", label: "Paciente", type: "select", options: PACIENTE_OPTIONS,
        tooltip: "Na interface é Paciente, tecnicamente usa cliente_id." },
      { name: "convenioId", label: "Convênio", type: "select", options: CONVENIO_OPTIONS,
        tooltip: "Preenchido automaticamente quando houver conta." },
      { name: "descricaoManual", label: "Descrição manual", type: "text" },
      { name: "statusItemId", label: "Status do Item", type: "select",
        options: opts.statusItem, required: true },
      { name: "motivoDevolucaoId", label: "Motivo de devolução", type: "select",
        options: opts.motivos },
      { name: "observacao", label: "Observação", type: "textarea" },
    ],
    listColumns: ["protocoloId", "tipoItemId", "clienteId", "convenioId", "statusItemId"],
    searchableFields: ["descricaoManual", "observacao"],
  };

  return <FluxodocsCrudPage config={config} />;
}
