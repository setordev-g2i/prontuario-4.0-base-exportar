import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { WorkflowTiposDocumentoForm, type WorkflowTiposDocumentoFormValues } from "./FluxodocsWorkflowTiposDocumentoForm";
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";
import { createWorkflowTiposDocumento, updateWorkflowTiposDocumento } from "@/services/fluxodocsWorkflowTiposDocumento";

export type FluxodocsWorkflowTiposDocumentoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsWorkflowTiposDocumentoModalMode;
  registro?: FluxodocsWorkflowTipoDocumento | null;
  onSaved: () => void;
}

export function FluxodocsWorkflowTiposDocumentoModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Workflow"
      : mode === "edit"
        ? "Editar Workflow"
        : "Visualizar Workflow";

  async function handleSubmit(values: WorkflowTiposDocumentoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createWorkflowTiposDocumento(values as never);
        toast.success("Workflow cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateWorkflowTiposDocumento(registro.id, values as never);
        toast.success("Workflow atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar workflow"
            : "Erro ao atualizar workflow",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <WorkflowTiposDocumentoForm
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
