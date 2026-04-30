import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";
import { documentosObrigatoriosConvenioService } from "@/services/fluxodocs/documentosObrigatoriosConvenio";
import { tiposDocumentoService } from "@/services/fluxodocs/tiposDocumento";
import { tiposMovimentacaoService } from "@/services/fluxodocs/tiposMovimentacao";
import { prioridadesService } from "@/services/fluxodocs/prioridades";
import { fetchConveniosOptions } from "@/services/fluxodocs/externalOptions";

const config: CrudConfig<FluxodocsDocumentoObrigatorioConvenio> = {
  entity: "fluxodocs-documentos-obrigatorios-convenio",
  titlePlural: "Documentação por Convênio",
  titleSingular: "Documento Obrigatório",
  searchKey: "descricao",
  tooltip: "Documentos exigidos por convênio. Não se aplica a itens avulsos sem convênio.",
  service: documentosObrigatoriosConvenioService,
  fields: [
    { key: "convenioId", label: "Convênio", type: "select", required: true, span: 1, optionsSource: fetchConveniosOptions },
    { key: "tipoDocumentoId", label: "Tipo Documento", type: "select", required: true, span: 1, optionsSource: () => tiposDocumentoService.fetchOptions("nome") },
    { key: "tipoMovimentacaoId", label: "Tipo Movimentação", type: "select", span: 1, nullable: true, optionsSource: () => tiposMovimentacaoService.fetchOptions("nome") },
    { key: "prioridadeId", label: "Prioridade", type: "select", span: 1, nullable: true, optionsSource: () => prioridadesService.fetchOptions("nome") },
    { key: "obrigatorio", label: "Obrigatório", type: "boolean", span: 1 },
    { key: "bloqueiaEnvio", label: "Bloqueia envio", type: "boolean", span: 1, tooltip: "Se ativo, impede envio sem o documento." },
    { key: "exigeJustificativaAusencia", label: "Exige justificativa", type: "boolean", span: 1 },
    { key: "exigeAprovacaoJustificativa", label: "Exige aprovação", type: "boolean", span: 1, tooltip: "Quando justificado, ainda exige aprovação para liberar envio." },
    { key: "descricao", label: "Descrição", type: "textarea", span: 3 },
  ],
};

export default function FluxodocsDocumentosObrigatoriosConvenioPage() {
  return <CrudPage config={config} />;
}
