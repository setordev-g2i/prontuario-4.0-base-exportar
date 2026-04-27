import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfissionalForm } from "./components/ProfissionalForm";
import {
  fetchProfissional,
  updateProfissional,
} from "@/services/profissionais";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalFormValues } from "@/lib/schemas/profissionais/formSchema";

export default function ProfissionaisEditarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [profissional, setProfissional] = useState<Profissional | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProfissional(id)
      .then((p) => setProfissional(p ?? null))
      .catch(() => toast.error("Erro ao carregar profissional"))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(values: ProfissionalFormValues) {
    if (!id) return;
    setSubmitting(true);
    try {
      await updateProfissional(id, values);
      toast.success("Profissional atualizado");
      navigate("/configuracoes/profissionais");
    } catch {
      toast.error("Erro ao atualizar profissional");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Carregando profissional...
      </div>
    );
  }

  if (!profissional) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Profissional não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold">Editar profissional</h1>
        <p className="text-sm text-muted-foreground">{profissional.nome}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfissionalForm
            mode="edit"
            initialData={{
              nome: profissional.nome,
              tipoCadastroId: profissional.tipoCadastroId,
              cpf: profissional.cpf,
              rg: profissional.rg ?? "",
              dataNascimento: profissional.dataNascimento,
              sexo: profissional.sexo as "masculino" | "feminino" | "outro" | undefined,
              conselho: profissional.conselho ?? "",
              situacaoId: profissional.situacaoId,
            }}
            onSubmit={handleSubmit}
            onCancel={() => navigate("/configuracoes/profissionais")}
            submitting={submitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}
