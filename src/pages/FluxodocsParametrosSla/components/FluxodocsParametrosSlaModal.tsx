import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ParametrosSlaForm, type ParametrosSlaFormValues } from "./FluxodocsParametrosSlaForm";
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";
import { createParametrosSla, updateParametrosSla } from "@/services/fluxodocsParametrosSla";

export type FluxodocsParametrosSlaModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsParametrosSlaModalMode;
  registro?: FluxodocsParametroSla | null;
  onSaved: () => void;
}

export function FluxodocsParametrosSlaModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Parâmetro de SLA"
      : mode === "edit"
        ? "Editar Parâmetro de SLA"
        : "Visualizar Parâmetro de SLA";

  async function handleSubmit(values: ParametrosSlaFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createParametrosSla(values as never);
        toast.success("Parâmetro de SLA cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateParametrosSla(registro.id, values as never);
        toast.success("Parâmetro de SLA atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar parâmetro de sla"
            : "Erro ao atualizar parâmetro de sla",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <ParametrosSlaForm
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
