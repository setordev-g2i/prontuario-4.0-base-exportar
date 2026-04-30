import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { TiposItemForm, type TiposItemFormValues } from "./FluxodocsTiposItemForm";
import type { FluxodocsTipoItem } from "@/types/entities/Fluxodocs";
import { createTiposItem, updateTiposItem } from "@/services/fluxodocsTiposItem";

export type FluxodocsTiposItemModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsTiposItemModalMode;
  registro?: FluxodocsTipoItem | null;
  onSaved: () => void;
}

export function FluxodocsTiposItemModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Tipo de Item"
      : mode === "edit"
        ? "Editar Tipo de Item"
        : "Visualizar Tipo de Item";

  async function handleSubmit(values: TiposItemFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createTiposItem(values as never);
        toast.success("Tipo de Item cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateTiposItem(registro.id, values as never);
        toast.success("Tipo de Item atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar tipo de item"
            : "Erro ao atualizar tipo de item",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <TiposItemForm
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
