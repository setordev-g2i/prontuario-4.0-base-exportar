import { FluxodocsCrudPage, type EntityConfig } from "@/lib/fluxodocs/CrudPage";
import { documentosObrigatoriosConvenioService } from "@/services/fluxodocs";
import { useFluxodocsOptions, CONVENIO_OPTIONS } from "@/lib/fluxodocs/options";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";

export default function FluxodocsDocumentosObrigatoriosConvenioPage() {
  const opts = useFluxodocsOptions();

  const config: EntityConfig<FluxodocsDocumentoObrigatorioConvenio> = {
    singular: "Documentação por Convênio",
    plural: "Documentação por Convênio",
    service: documentosObrigatoriosConvenioService,
    fields: [
      { name: "convenioId", label: "Convênio", type: "select",
        options: CONVENIO_OPTIONS, required: true },
      { name: "tipoDocumentoId", label: "Tipo Documento", type: "select",
        options: opts.tiposDoc, required: true },
      { name: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select",
        options: opts.tiposMov },
      { name: "prioridadeId", label: "Prioridade", type: "select",
        options: opts.prioridades },
      { name: "obrigatorio", label: "Obrigatório", type: "boolean" },
      { name: "bloqueiaEnvio", label: "Bloqueia envio", type: "boolean",
        tooltip: "Quando ativo, impede envio sem o documento." },
      { name: "exigeJustificativaAusencia", label: "Exige justificativa", type: "boolean" },
      { name: "exigeAprovacaoJustificativa", label: "Exige aprovação da justificativa", type: "boolean" },
      { name: "descricao", label: "Descrição", type: "textarea" },
    ],
    listColumns: ["convenioId", "tipoDocumentoId", "obrigatorio", "bloqueiaEnvio"],
    defaults: { obrigatorio: true, bloqueiaEnvio: false, exigeJustificativaAusencia: false, exigeAprovacaoJustificativa: false },
  };

  return <FluxodocsCrudPage config={config} />;
}
