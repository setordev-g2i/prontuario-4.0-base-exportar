import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ProtocoloItenForm, type ProtocoloItenFormValues } from "./FluxodocsProtocoloItensForm";
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";
import { createProtocoloIten, updateProtocoloIten } from "@/services/fluxodocsProtocoloItens";

export type FluxodocsProtocoloItensModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsProtocoloItensModalMode;
  registro?: FluxodocsProtocoloItem | null;
  onSaved: () => void;
}

export function FluxodocsProtocoloItensModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Item de Protocolo"
      : mode === "edit"
        ? "Editar Item de Protocolo"
        : "Visualizar Item de Protocolo";

  async function handleSubmit(values: ProtocoloItenFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createProtocoloIten(values as never);
        toast.success("Item de Protocolo cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateProtocoloIten(registro.id, values as never);
        toast.success("Item de Protocolo atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar item de protocolo"
            : "Erro ao atualizar item de protocolo",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <ProtocoloItenForm
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
