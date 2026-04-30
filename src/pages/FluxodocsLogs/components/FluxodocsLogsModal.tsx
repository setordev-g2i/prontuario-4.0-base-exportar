import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { LogForm, type LogFormValues } from "./FluxodocsLogsForm";
import type { FluxodocsLog } from "@/types/entities/Fluxodocs";
import { createLog, updateLog } from "@/services/fluxodocsLogs";

export type FluxodocsLogsModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsLogsModalMode;
  registro?: FluxodocsLog | null;
  onSaved: () => void;
}

export function FluxodocsLogsModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Log"
      : mode === "edit"
        ? "Editar Log"
        : "Visualizar Log";

  async function handleSubmit(values: LogFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createLog(values as never);
        toast.success("Log cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateLog(registro.id, values as never);
        toast.success("Log atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar log"
            : "Erro ao atualizar log",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <LogForm
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
