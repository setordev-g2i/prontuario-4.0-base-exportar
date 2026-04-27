import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfissionalForm } from "./components/ProfissionalForm";
import { createProfissional } from "@/services/profissionais";
import type { ProfissionalFormValues } from "@/lib/schemas/profissionais/formSchema";

export default function ProfissionaisNovoPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(values: ProfissionalFormValues) {
    setSubmitting(true);
    try {
      await createProfissional(values);
      toast.success("Profissional cadastrado com sucesso");
      navigate("/configuracoes/profissionais");
    } catch {
      toast.error("Erro ao cadastrar profissional");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Novo profissional</h1>
        <p className="text-sm text-muted-foreground">
          Preencha os dados para cadastrar um novo profissional
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfissionalForm
            mode="create"
            onSubmit={handleSubmit}
            onCancel={() => navigate("/configuracoes/profissionais")}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
