import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { StatusItemForm, type StatusItemFormValues } from "./FluxodocsStatusItemForm";
import type { FluxodocsStatusItem } from "@/types/entities/Fluxodocs";
import { createStatusItem, updateStatusItem } from "@/services/fluxodocsStatusItem";

export type FluxodocsStatusItemModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsStatusItemModalMode;
  registro?: FluxodocsStatusItem | null;
  onSaved: () => void;
}

export function FluxodocsStatusItemModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Status do Item"
      : mode === "edit"
        ? "Editar Status do Item"
        : "Visualizar Status do Item";

  async function handleSubmit(values: StatusItemFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createStatusItem(values as never);
        toast.success("Status do Item cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateStatusItem(registro.id, values as never);
        toast.success("Status do Item atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar status do item"
            : "Erro ao atualizar status do item",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <StatusItemForm
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
