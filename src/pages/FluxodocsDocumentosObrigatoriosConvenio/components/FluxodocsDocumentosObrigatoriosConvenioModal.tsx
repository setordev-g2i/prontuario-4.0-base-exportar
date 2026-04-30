import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { DocumentosObrigatoriosConvenioForm, type DocumentosObrigatoriosConvenioFormValues } from "./FluxodocsDocumentosObrigatoriosConvenioForm";
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";
import { createDocumentosObrigatoriosConvenio, updateDocumentosObrigatoriosConvenio } from "@/services/fluxodocsDocumentosObrigatoriosConvenio";

export type FluxodocsDocumentosObrigatoriosConvenioModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsDocumentosObrigatoriosConvenioModalMode;
  registro?: FluxodocsDocumentoObrigatorioConvenio | null;
  onSaved: () => void;
}

export function FluxodocsDocumentosObrigatoriosConvenioModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Documento Obrigatório por Convênio"
      : mode === "edit"
        ? "Editar Documento Obrigatório por Convênio"
        : "Visualizar Documento Obrigatório por Convênio";

  async function handleSubmit(values: DocumentosObrigatoriosConvenioFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createDocumentosObrigatoriosConvenio(values as never);
        toast.success("Documento Obrigatório por Convênio cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateDocumentosObrigatoriosConvenio(registro.id, values as never);
        toast.success("Documento Obrigatório por Convênio atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar documento obrigatório por convênio"
            : "Erro ao atualizar documento obrigatório por convênio",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <DocumentosObrigatoriosConvenioForm
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
