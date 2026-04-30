import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ParametrosIaForm, type ParametrosIaFormValues } from "./FluxodocsParametrosIaForm";
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";
import { createParametrosIa, updateParametrosIa } from "@/services/fluxodocsParametrosIa";

export type FluxodocsParametrosIaModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsParametrosIaModalMode;
  registro?: FluxodocsParametroIa | null;
  onSaved: () => void;
}

export function FluxodocsParametrosIaModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Parâmetro de IA"
      : mode === "edit"
        ? "Editar Parâmetro de IA"
        : "Visualizar Parâmetro de IA";

  async function handleSubmit(values: ParametrosIaFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createParametrosIa(values as never);
        toast.success("Parâmetro de IA cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateParametrosIa(registro.id, values as never);
        toast.success("Parâmetro de IA atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar parâmetro de ia"
            : "Erro ao atualizar parâmetro de ia",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <ParametrosIaForm
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
