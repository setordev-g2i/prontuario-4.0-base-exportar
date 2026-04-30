import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { RegrasFluxoForm, type RegrasFluxoFormValues } from "./FluxodocsRegrasFluxoForm";
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";
import { createRegrasFluxo, updateRegrasFluxo } from "@/services/fluxodocsRegrasFluxo";

export type FluxodocsRegrasFluxoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsRegrasFluxoModalMode;
  registro?: FluxodocsRegraFluxo | null;
  onSaved: () => void;
}

export function FluxodocsRegrasFluxoModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Regra de Fluxo"
      : mode === "edit"
        ? "Editar Regra de Fluxo"
        : "Visualizar Regra de Fluxo";

  async function handleSubmit(values: RegrasFluxoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createRegrasFluxo(values as never);
        toast.success("Regra de Fluxo cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateRegrasFluxo(registro.id, values as never);
        toast.success("Regra de Fluxo atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar regra de fluxo"
            : "Erro ao atualizar regra de fluxo",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <RegrasFluxoForm
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
