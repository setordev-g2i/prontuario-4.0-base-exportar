import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { AprovacoesJustificativaForm, type AprovacoesJustificativaFormValues } from "./FluxodocsAprovacoesJustificativaForm";
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";
import { createAprovacoesJustificativa, updateAprovacoesJustificativa } from "@/services/fluxodocsAprovacoesJustificativa";

export type FluxodocsAprovacoesJustificativaModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsAprovacoesJustificativaModalMode;
  registro?: FluxodocsAprovacaoJustificativa | null;
  onSaved: () => void;
}

export function FluxodocsAprovacoesJustificativaModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Aprovação de Justificativa"
      : mode === "edit"
        ? "Editar Aprovação de Justificativa"
        : "Visualizar Aprovação de Justificativa";

  async function handleSubmit(values: AprovacoesJustificativaFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createAprovacoesJustificativa(values as never);
        toast.success("Aprovação de Justificativa cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateAprovacoesJustificativa(registro.id, values as never);
        toast.success("Aprovação de Justificativa atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar aprovação de justificativa"
            : "Erro ao atualizar aprovação de justificativa",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <AprovacoesJustificativaForm
        mode={mode === "edit" ? "edit" : "create"}
        readOnly={mode === "view"}
        initial={registro}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        submitting={submitting}
      />
    </FormModal>
  );
}
