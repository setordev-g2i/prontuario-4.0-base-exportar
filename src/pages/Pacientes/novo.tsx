import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PacienteForm } from "./components/PacienteForm";
import { createPaciente } from "@/services/pacientes";
import { useState } from "react";
import type { PacienteFormValues } from "@/lib/schemas/paciente";

export default function PacientesNovoPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: PacienteFormValues) {
    setSubmitting(true);
    try {
      await createPaciente(values);
      toast.success("Paciente cadastrado com sucesso");
      navigate("/pacientes");
    } catch {
      toast.error("Erro ao cadastrar paciente");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Novo paciente</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados para cadastrar um novo paciente
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <PacienteForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/pacientes")}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
