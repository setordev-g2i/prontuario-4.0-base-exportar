import { toast } from "sonner";
import { FormModal } from "@/components/FormModal";
import { PacienteForm } from "./PacienteForm";
import type { Paciente } from "@/types/entities/Paciente";
import type { PacienteFormValues } from "@/lib/schemas/paciente";
import { createPaciente, updatePaciente } from "@/services/pacientes";
import { useState } from "react";

export type PacienteModalMode = "create" | "edit" | "view";

interface PacienteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: PacienteModalMode;
  paciente?: Paciente | null;
  onSaved: () => void;
}

export function PacienteModal({
  open,
  onOpenChange,
  mode,
  paciente,
  onSaved,
}: PacienteModalProps) {
  const [submitting, setSubmitting] = useState(false);

  const title =
    mode === "create"
      ? "Novo Paciente"
      : mode === "edit"
        ? "Editar Paciente"
        : "Visualizar Paciente";

  const description =
    mode !== "create" && paciente ? paciente.nome : undefined;

  const initialData: Partial<PacienteFormValues> | undefined = paciente
    ? {
        nome: paciente.nome,
        cpf: paciente.cpf,
        rg: paciente.rg ?? "",
        dataNascimento: paciente.dataNascimento,
        sexo: paciente.sexo,
        email: paciente.email ?? "",
        telefone: paciente.telefone ?? "",
        celular: paciente.celular ?? "",
        cep: paciente.cep ?? "",
        endereco: paciente.endereco ?? "",
        numero: paciente.numero ?? "",
        complemento: paciente.complemento ?? "",
        bairro: paciente.bairro ?? "",
        cidade: paciente.cidade ?? "",
        estadoId:
          typeof paciente.estadoId === "number"
            ? String(paciente.estadoId)
            : (paciente.estadoId ?? ""),
        situacaoId: paciente.situacaoId,
      }
    : undefined;

  async function handleSubmit(values: PacienteFormValues) {
    setSubmitting(true);
    try {
      if (mode === "create") {
        await createPaciente(values);
        toast.success("Paciente cadastrado com sucesso");
      } else if (mode === "edit" && paciente) {
        await updatePaciente(paciente.id, values);
        toast.success("Paciente atualizado");
      }
      onOpenChange(false);
      onSaved();
    } catch {
      toast.error(
        mode === "create"
          ? "Erro ao cadastrar paciente"
          : "Erro ao atualizar paciente",
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
      <PacienteForm
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
