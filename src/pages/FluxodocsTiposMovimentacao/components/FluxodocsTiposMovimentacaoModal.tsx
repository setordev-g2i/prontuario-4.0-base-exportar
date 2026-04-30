import { useState } from "react";
import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { TiposMovimentacaoForm, type TiposMovimentacaoFormValues } from "./FluxodocsTiposMovimentacaoForm";
import type { FluxodocsTipoMovimentacao } from "@/types/entities/Fluxodocs";
import { createTiposMovimentacao, updateTiposMovimentacao } from "@/services/fluxodocsTiposMovimentacao";

export type FluxodocsTiposMovimentacaoModalMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: FluxodocsTiposMovimentacaoModalMode;
  registro?: FluxodocsTipoMovimentacao | null;
  onSaved: () => void;
}

export function FluxodocsTiposMovimentacaoModal({
  open,
  onOpenChange,
  mode,
  registro,
  onSaved,
}: Props) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo(a) Tipo de Movimentação"
      : mode === "edit"
        ? "Editar Tipo de Movimentação"
        : "Visualizar Tipo de Movimentação";

  async function handleSubmit(values: TiposMovimentacaoFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createTiposMovimentacao(values as never);
        toast.success("Tipo de Movimentação cadastrado(a) com sucesso!");
      } else if (mode === "edit" && registro) {
        await updateTiposMovimentacao(registro.id, values as never);
        toast.success("Tipo de Movimentação atualizado(a) com sucesso!");
      }
      onOpenChange(false);
      onSaved();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : mode === "create"
            ? "Erro ao cadastrar tipo de movimentação"
            : "Erro ao atualizar tipo de movimentação",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal open={open} onOpenChange={onOpenChange} title={title}>
      <TiposMovimentacaoForm
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
