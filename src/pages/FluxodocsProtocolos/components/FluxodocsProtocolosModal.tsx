import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ProtocoloForm, type ProtocoloFormValues } from "./FluxodocsProtocolosForm";
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";
import { createProtocolo, updateProtocolo } from "@/services/fluxodocsProtocolos";

export type FluxodocsProtocolosModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsProtocolosModalMode;
  registro?: FluxodocsProtocolo | null;
  onSaved: () => void;
}

export function FluxodocsProtocolosModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Protocolo"
      : mode === "edit"
        ? "Editar Protocolo"
        : "Visualizar Protocolo";

  async function handleSubmit(values: ProtocoloFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createProtocolo(values as never);
        toast.success("Protocolo cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateProtocolo(registro.id, values as never);
        toast.success("Protocolo atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar protocolo"
            : "Erro ao atualizar protocolo",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <ProtocoloForm
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
