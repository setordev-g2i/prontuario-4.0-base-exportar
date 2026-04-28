import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import {
  GrupoProcedimentoForm,
  type GrupoProcedimentoFormValues,
} from "./GrupoProcedimentoForm";
import type { GrupoProcedimento } from "@/types/entities/GrupoProcedimento";
import {
  createGrupoProcedimento,
  updateGrupoProcedimento,
} from "@/services/gruposProcedimentos";

export type GrupoProcedimentoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: GrupoProcedimentoModalMode;
  grupo?: GrupoProcedimento | null;
  onSaved: () => void;
}

export function GrupoProcedimentoModal({
  open,
  onOpenChange,
  mode,
  grupo,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("principal");

  useEffect(() => {
    if (open) setActiveTab("principal");
  }, [open, mode, grupo?.id]);

  const title =
    mode === "create"
      ? "Novo Grupo de Procedimentos"
      : mode === "edit"
        ? "Editar Grupo de Procedimentos"
        : "Visualizar Grupo de Procedimentos";

  const description = mode !== "create" && grupo ? grupo.nome : undefined;

  const initialData: Partial<GrupoProcedimentoFormValues> | undefined = grupo
    ? {
        codigoGrupo: grupo.codigoGrupo,
        nome: grupo.nome,
        situacaoId: grupo.situacaoId,
        color: grupo.color,
        procedimentoSubGrupoId: grupo.procedimentoSubGrupoId,
        percentualLucro: grupo.percentualLucro ?? null,
        percentualDesconto: grupo.percentualDesconto ?? null,
        tipoDataFaturamento: grupo.tipoDataFaturamento ?? null,
        faturaTabelaConvenioCapituloId:
          grupo.faturaTabelaConvenioCapituloId ?? null,
        contabilidadeCodreduzido: grupo.contabilidadeCodreduzido ?? "",
        utilizaInternacaoMapaImpressaoColunaAcomodacao:
          !!grupo.utilizaInternacaoMapaImpressaoColunaAcomodacao,
        utilizaInternacaoMapaImpressaoColunaProcedimentos:
          !!grupo.utilizaInternacaoMapaImpressaoColunaProcedimentos,
        relProducaoTotalizaMedico: !!grupo.relProducaoTotalizaMedico,
        relProducaoTotalizaMatmed: !!grupo.relProducaoTotalizaMatmed,
        relProducaoRelExecutante: !!grupo.relProducaoRelExecutante,
        relProducaoRelSolicitante: !!grupo.relProducaoRelSolicitante,
        homecareNomeGrupoRelatorio: grupo.homecareNomeGrupoRelatorio ?? "",
        homecareOrdemOrcamento: grupo.homecareOrdemOrcamento ?? null,
        homecareListaEquipamentoRequisitar:
          !!grupo.homecareListaEquipamentoRequisitar,
        modalidadedicom: grupo.modalidadedicom ?? "",
      }
    : undefined;

  async function handleSubmit(values: GrupoProcedimentoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createGrupoProcedimento(values);
        toast.success("Grupo de procedimentos cadastrado com sucesso!");
      } else if (mode === "edit" && grupo) {
        await updateGrupoProcedimento(grupo.id, values);
        toast.success("Grupo de procedimentos atualizado com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (e) {
      toast.error(
        e instanceof Error
          ? e.message
          : mode === "create"
            ? "Erro ao cadastrar grupo de procedimentos"
            : "Erro ao atualizar grupo de procedimentos",
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
      <GrupoProcedimentoForm
        mode={mode === "edit" ? "edit" : "create"}
        readOnly={mode === "view"}
        initialData={initialData}
        meta={grupo ?? null}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        submitting={submitting}
        activeTab={activeTab}
        onActiveTabChange={setActiveTab}
      />
    </FormModal>
  );
}
