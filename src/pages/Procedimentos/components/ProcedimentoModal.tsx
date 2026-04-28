import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import {
  ProcedimentoForm,
  type ProcedimentoFormValues,
} from "./ProcedimentoForm";
import type { Procedimento } from "@/types/entities/Procedimento";
import {
  createProcedimento,
  updateProcedimento,
} from "@/services/procedimentos";

export type ProcedimentoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProcedimentoModalMode;
  procedimento?: Procedimento | null;
  onSaved: () => void;
}

export function ProcedimentoModal({
  open,
  onOpenChange,
  mode,
  procedimento,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("principal");

  useEffect(() => {
    if (open) setActiveTab("principal");
  }, [open, mode, procedimento?.id]);

  const title =
    mode === "create"
      ? "Cadastro de Procedimentos"
      : mode === "edit"
        ? "Editar Procedimento"
        : "Visualizar Procedimento";

  const description =
    mode !== "create" && procedimento ? procedimento.nome : undefined;

  const initialData: Partial<ProcedimentoFormValues> | undefined = procedimento
    ? {
        nome: procedimento.nome,
        grupoId: procedimento.grupoId,
        anotacaoFolha: procedimento.anotacaoFolha ?? "",
        diasEntrega: procedimento.diasEntrega ?? null,
        procedimentoModuloUtilizacaoId:
          procedimento.procedimentoModuloUtilizacaoId ?? null,
        apelido: procedimento.apelido ?? "",
        codigoTabAmb: procedimento.codigoTabAmb ?? "",
        situacaoId: procedimento.situacaoId,

        faturaTipoCobrancaFaturaValorId:
          procedimento.faturaTipoCobrancaFaturaValorId,
        procedimentoSubGrupoId: procedimento.procedimentoSubGrupoId,
        usaGuiaOutrasDespesas: !!procedimento.usaGuiaOutrasDespesas,
        usaGuiaResumoInternacao: !!procedimento.usaGuiaResumoInternacao,
        usaGuiaSadt: !!procedimento.usaGuiaSadt,
        usaGuiaHonorarioIndividual: !!procedimento.usaGuiaHonorarioIndividual,
        usaGuiaConsulta: !!procedimento.usaGuiaConsulta,
        abaFaturamentoPadrao: procedimento.abaFaturamentoPadrao ?? null,
        consideraComoMatMed: !!procedimento.consideraComoMatMed,

        susCodigoProcedimento: procedimento.susCodigoProcedimento,
        susNomeProcedimento: procedimento.susNomeProcedimento,
        susSexo: procedimento.susSexo,
        susPermanenciaMedia: procedimento.susPermanenciaMedia,
        susPermanenciaTempo: procedimento.susPermanenciaTempo,
        susPermanenciaMaximo: procedimento.susPermanenciaMaximo,
        susPontos: procedimento.susPontos,
        susIdadeMinimaMeses: procedimento.susIdadeMinimaMeses,
        susIdadeMaximaMeses: procedimento.susIdadeMaximaMeses,
        susGrupoId: procedimento.susGrupoId ?? null,
        susSubgrupoId: procedimento.susSubgrupoId ?? null,
        susFormaOrganizacao: procedimento.susFormaOrganizacao,
        susModalidade: procedimento.susModalidade,
        susSistemaFaturamento: procedimento.susSistemaFaturamento,
        procedimentoPrincipal: !!procedimento.procedimentoPrincipal,
        susPreencheAihParto: !!procedimento.susPreencheAihParto,
        susPreencheAihLaqueaduraVasectomia:
          !!procedimento.susPreencheAihLaqueaduraVasectomia,
        susPreencheAihOpme: !!procedimento.susPreencheAihOpme,
        susPreencheAihUtiNeoNatal: !!procedimento.susPreencheAihUtiNeoNatal,
        susPreencheAihRegistroCivil:
          !!procedimento.susPreencheAihRegistroCivil,
        cihaTipoProcedimento: procedimento.cihaTipoProcedimento ?? "0",
        susPreencheApacTipo: procedimento.susPreencheApacTipo ?? null,

        nomeLaudo: procedimento.nomeLaudo,
        digitaLaudo: !!procedimento.digitaLaudo,
        origemLaudo: procedimento.origemLaudo ?? null,
        laudoMetaFormularioId: procedimento.laudoMetaFormularioId ?? null,
        responsavelAssinaturaLaudo:
          procedimento.responsavelAssinaturaLaudo ?? null,

        produtividadeSolicitantePaga:
          !!procedimento.produtividadeSolicitantePaga,
        regraPagamentoProdutividade:
          procedimento.regraPagamentoProdutividade ?? null,
        regraPagamentoProfissionalEspecifico:
          procedimento.regraPagamentoProfissionalEspecifico ?? null,

        mostraTelaAtenderProcedimento:
          !!procedimento.mostraTelaAtenderProcedimento,
        sadtMostraData: !!procedimento.sadtMostraData,
        fichaAtendimentoImpressaUrlModelo:
          procedimento.fichaAtendimentoImpressaUrlModelo ?? "",
        sumarioAltaHabilitado: !!procedimento.sumarioAltaHabilitado,
        habilitaRelAgendamento: !!procedimento.habilitaRelAgendamento,

        homeCareVlCusto: procedimento.homeCareVlCusto ?? null,
        hcaaCodigo: procedimento.hcaaCodigo ?? "",
        grupoAgendaSessoesId: procedimento.grupoAgendaSessoesId ?? null,

        prescricaoTipoId: procedimento.prescricaoTipoId ?? null,
        seraUtilizadoAso: !!procedimento.seraUtilizadoAso,
        prescricaoHabilitaDescricaoCentroCirurgico:
          !!procedimento.prescricaoHabilitaDescricaoCentroCirurgico,
        prescricaoHabilitaDescricaoCirurgicaBeiraLeito:
          !!procedimento.prescricaoHabilitaDescricaoCirurgicaBeiraLeito,
        geraEquipeAutomaticamente: !!procedimento.geraEquipeAutomaticamente,
        permiteLancarEquipe: !!procedimento.permiteLancarEquipe,
        comboProcedimentos: !!procedimento.comboProcedimentos,
        estqArtigoId: procedimento.estqArtigoId ?? null,
      }
    : undefined;

  async function handleSubmit(values: ProcedimentoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createProcedimento(values);
        toast.success("Procedimento cadastrado com sucesso!");
      } else if (mode === "edit" && procedimento) {
        await updateProcedimento(procedimento.id, values);
        toast.success("Procedimento atualizado com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : mode === "create"
            ? "Erro ao cadastrar procedimento"
            : "Erro ao atualizar procedimento",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <ProcedimentoForm
        mode={mode === "edit" ? "edit" : "create"}
        readOnly={mode === "view"}
        initialData={initialData}
        meta={procedimento ?? null}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        submitting={submitting}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
    </FormModal>
  );
}
