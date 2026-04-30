import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { MotivoForm, type MotivoFormValues } from "./FluxodocsMotivosForm";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";
import { createMotivo, updateMotivo } from "@/services/fluxodocsMotivos";

export type FluxodocsMotivosModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsMotivosModalMode;
  registro?: FluxodocsMotivo | null;
  onSaved: () => void;
}

export function FluxodocsMotivosModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Motivo"
      : mode === "edit"
        ? "Editar Motivo"
        : "Visualizar Motivo";

  async function handleSubmit(values: MotivoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createMotivo(values as never);
        toast.success("Motivo cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateMotivo(registro.id, values as never);
        toast.success("Motivo atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar motivo"
            : "Erro ao atualizar motivo",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <MotivoForm
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
