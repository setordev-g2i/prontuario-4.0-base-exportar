import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PacienteForm } from "./components/PacienteForm";
import { fetchPaciente, updatePaciente } from "@/services/pacientes";
import type { Paciente } from "@/types/entities/Paciente";
import type { PacienteFormValues } from "@/lib/schemas/paciente";

export default function PacientesEditarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPaciente(id)
      .then((p) => setPaciente(p ?? null))
      .catch(() => toast.error("Erro ao carregar paciente"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: PacienteFormValues) {
    if (!id) return;
    setSubmitting(true);
    try {
      await updatePaciente(id, values);
      toast.success("Paciente atualizado");
      navigate("/pacientes");
    } catch {
      toast.error("Erro ao atualizar paciente");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Carregando paciente...
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Paciente não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Editar paciente</h1>
        <p className="text-sm text-muted-foreground">{paciente.nome}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PacienteForm
            mode="edit"
            initialData={{
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
              estadoId: paciente.estadoId ?? "",
              situacaoId: paciente.situacaoId,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/pacientes")}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
