import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ChecklistDocumentalForm, type ChecklistDocumentalFormValues } from "./FluxodocsChecklistDocumentalForm";
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";
import { createChecklistDocumental, updateChecklistDocumental } from "@/services/fluxodocsChecklistDocumental";

export type FluxodocsChecklistDocumentalModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsChecklistDocumentalModalMode;
  registro?: FluxodocsChecklistDocumental | null;
  onSaved: () => void;
}

export function FluxodocsChecklistDocumentalModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Checklist Documental"
      : mode === "edit"
        ? "Editar Checklist Documental"
        : "Visualizar Checklist Documental";

  async function handleSubmit(values: ChecklistDocumentalFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createChecklistDocumental(values as never);
        toast.success("Checklist Documental cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateChecklistDocumental(registro.id, values as never);
        toast.success("Checklist Documental atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar checklist documental"
            : "Erro ao atualizar checklist documental",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <ChecklistDocumentalForm
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
