import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { SetoreForm, type SetoreFormValues } from "./FluxodocsSetoresForm";
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";
import { createSetore, updateSetore } from "@/services/fluxodocsSetores";

export type FluxodocsSetoresModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsSetoresModalMode;
  registro?: FluxodocsSetor | null;
  onSaved: () => void;
}

export function FluxodocsSetoresModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Setor"
      : mode === "edit"
        ? "Editar Setor"
        : "Visualizar Setor";

  async function handleSubmit(values: SetoreFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createSetore(values as never);
        toast.success("Setor cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateSetore(registro.id, values as never);
        toast.success("Setor atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar setor"
            : "Erro ao atualizar setor",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <SetoreForm
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
