import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { WorkflowEtapaForm, type WorkflowEtapaFormValues } from "./FluxodocsWorkflowEtapasForm";
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";
import { createWorkflowEtapa, updateWorkflowEtapa } from "@/services/fluxodocsWorkflowEtapas";

export type FluxodocsWorkflowEtapasModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsWorkflowEtapasModalMode;
  registro?: FluxodocsWorkflowEtapa | null;
  onSaved: () => void;
}

export function FluxodocsWorkflowEtapasModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Etapa de Workflow"
      : mode === "edit"
        ? "Editar Etapa de Workflow"
        : "Visualizar Etapa de Workflow";

  async function handleSubmit(values: WorkflowEtapaFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createWorkflowEtapa(values as never);
        toast.success("Etapa de Workflow cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateWorkflowEtapa(registro.id, values as never);
        toast.success("Etapa de Workflow atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar etapa de workflow"
            : "Erro ao atualizar etapa de workflow",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <WorkflowEtapaForm
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
