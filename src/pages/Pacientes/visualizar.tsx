import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchPaciente } from "@/services/pacientes";
import type { Paciente } from "@/types/entities/Paciente";

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

export default function PacientesVisualizarPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [paciente, setPaciente] = useState<Paciente | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchPaciente(id)
      .then((p) => setPaciente(p ?? null))
      .catch(() => toast.error("Erro ao carregar paciente"))
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

  if (!paciente) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Paciente não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/pacientes"
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 size-3.5" /> Voltar
          </Link>
          <h1 className="text-2xl font-bold">{paciente.nome}</h1>
        </div>
        <Button onClick={() => navigate(`/pacientes/${paciente.id}/editar`)}>
          <Pencil className="mr-1 size-4" />
          Editar
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Dados do paciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nome" value={paciente.nome} />
            <Field label="CPF" value={paciente.cpf} />
            <Field label="RG" value={paciente.rg} />
            <Field
              label="Data de nascimento"
              value={
                paciente.dataNascimento
                  ? new Date(paciente.dataNascimento).toLocaleDateString("pt-BR")
                  : "—"
              }
            />
            <Field label="Sexo" value={paciente.sexo} />
            <Field label="Email" value={paciente.email} />
            <Field label="Telefone" value={paciente.telefone} />
            <Field label="Celular" value={paciente.celular} />
            <Field label="CEP" value={paciente.cep} />
            <Field label="Endereço" value={paciente.endereco} />
            <Field label="Número" value={paciente.numero} />
            <Field label="Complemento" value={paciente.complemento} />
            <Field label="Bairro" value={paciente.bairro} />
            <Field label="Cidade" value={paciente.cidade} />
            <Field label="UF" value={paciente.estadoId} />
            <Field
              label="Situação"
              value={
                <Badge
                  variant={paciente.situacaoId === 1 ? "default" : "secondary"}
                >
                  {paciente.situacaoId === 1 ? "Ativo" : "Inativo"}
                </Badge>
              }
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
