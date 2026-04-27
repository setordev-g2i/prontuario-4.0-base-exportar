import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Pencil, ArrowLeft, Briefcase, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchProfissional } from "@/services/profissionais";
import type { Profissional } from "@/types/entities/Profissional";

function Field({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-medium text-muted-foreground">{label}</div>
      <div className="text-sm">
        {value === undefined || value === null || value === "" ? "—" : value}
      </div>
    </div>
  );
}

export default function ProfissionaisVisualizarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [profissional, setProfissional] = useState<Profissional | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProfissional(id)
      .then((p) => setProfissional(p ?? null))
      .catch(() => toast.error("Erro ao carregar profissional"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Carregando...
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
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/configuracoes/profissionais"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 size-3.5" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">{profissional.nome}</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() =>
              navigate(`/configuracoes/profissionais/${profissional.id}/cbos`)
            }
          >
            <Briefcase className="mr-1 size-4" />
            CBOs
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              navigate(
                `/configuracoes/profissionais/${profissional.id}/especialidades`,
              )
            }
          >
            <Stethoscope className="mr-1 size-4" />
            Especialidades
          </Button>
          <Button
            onClick={() =>
              navigate(
                `/configuracoes/profissionais/${profissional.id}/editar`,
              )
            }
          >
            <Pencil className="mr-1 size-4" />
            Editar
          </Button>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do profissional</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome" value={profissional.nome} />
            <Field label="Tipo de cadastro" value={profissional.tipoCadastroId} />
            <Field label="CPF" value={profissional.cpf} />
            <Field label="RG" value={profissional.rg} />
            <Field
              label="Data de nascimento"
              value={
                profissional.dataNascimento
                  ? new Date(profissional.dataNascimento).toLocaleDateString(
                      "pt-BR",
                    )
                  : "—"
              }
            />
            <Field label="Sexo" value={profissional.sexo} />
            <Field label="Conselho" value={profissional.conselho} />
            <Field
              label="Situação"
              value={
                <Badge
                  variant={
                    profissional.situacaoId === 1 ? "default" : "secondary"
                  }
                >
                  {profissional.situacaoId === 1 ? "Ativo" : "Inativo"}
                </Badge>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
