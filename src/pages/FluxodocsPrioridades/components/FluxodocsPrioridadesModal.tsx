import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { PrioridadeForm, type PrioridadeFormValues } from "./FluxodocsPrioridadesForm";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";
import { createPrioridade, updatePrioridade } from "@/services/fluxodocsPrioridades";

export type FluxodocsPrioridadesModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsPrioridadesModalMode;
  registro?: FluxodocsPrioridade | null;
  onSaved: () => void;
}

export function FluxodocsPrioridadesModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Prioridade"
      : mode === "edit"
        ? "Editar Prioridade"
        : "Visualizar Prioridade";

  async function handleSubmit(values: PrioridadeFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createPrioridade(values as never);
        toast.success("Prioridade cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updatePrioridade(registro.id, values as never);
        toast.success("Prioridade atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar prioridade"
            : "Erro ao atualizar prioridade",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <PrioridadeForm
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
