import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { StatuForm, type StatuFormValues } from "./FluxodocsStatusForm";
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";
import { createStatu, updateStatu } from "@/services/fluxodocsStatus";

export type FluxodocsStatusModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsStatusModalMode;
  registro?: FluxodocsStatus | null;
  onSaved: () => void;
}

export function FluxodocsStatusModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Status"
      : mode === "edit"
        ? "Editar Status"
        : "Visualizar Status";

  async function handleSubmit(values: StatuFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createStatu(values as never);
        toast.success("Status cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateStatu(registro.id, values as never);
        toast.success("Status atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar status"
            : "Erro ao atualizar status",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <StatuForm
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
