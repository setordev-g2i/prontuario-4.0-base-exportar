import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { TiposDocumentoForm, type TiposDocumentoFormValues } from "./FluxodocsTiposDocumentoForm";
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";
import { createTiposDocumento, updateTiposDocumento } from "@/services/fluxodocsTiposDocumento";

export type FluxodocsTiposDocumentoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsTiposDocumentoModalMode;
  registro?: FluxodocsTipoDocumento | null;
  onSaved: () => void;
}

export function FluxodocsTiposDocumentoModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Tipo de Documento"
      : mode === "edit"
        ? "Editar Tipo de Documento"
        : "Visualizar Tipo de Documento";

  async function handleSubmit(values: TiposDocumentoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createTiposDocumento(values as never);
        toast.success("Tipo de Documento cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateTiposDocumento(registro.id, values as never);
        toast.success("Tipo de Documento atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar tipo de documento"
            : "Erro ao atualizar tipo de documento",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <TiposDocumentoForm
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
