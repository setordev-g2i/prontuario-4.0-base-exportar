import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { ProfissionalForm } from "./ProfissionalForm";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalFormValues } from "@/lib/schemas/profissionais/formSchema";
import {
  createProfissional,
  updateProfissional,
} from "@/services/profissionais";
import { useState } from "react";

export type ProfissionalModalMode = "create" | "edit" | "view";

interface ProfissionalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: ProfissionalModalMode;
  profissional?: Profissional | null;
  onSaved: () => void;
}

export function ProfissionalModal({
  open,
  onOpenChange,
  mode,
  profissional,
  onSaved,
}: ProfissionalModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo Profissional"
      : mode === "edit"
        ? "Editar Profissional"
        : "Visualizar Profissional";

  const description =
    mode !== "create" && profissional ? profissional.nome : undefined;

  const initialData: Partial<ProfissionalFormValues> | undefined = profissional
    ? {
        nome: profissional.nome,
        tipoCadastroId: profissional.tipoCadastroId,
        cpf: profissional.cpf,
        rg: profissional.rg ?? "",
        dataNascimento: profissional.dataNascimento,
        sexo: profissional.sexo as
          | "masculino"
          | "feminino"
          | "outro"
          | undefined,
        conselho: profissional.conselho ?? "",
        situacaoId: profissional.situacaoId,
      }
    : undefined;

  async function handleSubmit(values: ProfissionalFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createProfissional(values);
        toast.success("Profissional cadastrado com sucesso");
      } else if (mode === "edit" && profissional) {
        await updateProfissional(profissional.id, values);
        toast.success("Profissional atualizado");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error(
        mode === "create"
          ? "Erro ao cadastrar profissional"
          : "Erro ao atualizar profissional",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <FormModal
      open={open}
      onOpenChange={onOpenChange}
      title={title}
      description={description}
    >
      <ProfissionalForm
        mode={mode === "edit" ? "edit" : "create"}
        readOnly={mode === "view"}
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => onOpenChange(false)}
        submitting={submitting}
      />
    </FormModal>
  );
}
