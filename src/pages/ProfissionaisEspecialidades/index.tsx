import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { fetchProfissional } from "@/services/profissionais";
import {
  fetchProfissionalEspecialidades,
  inactivateProfissionalEspecialidade,
  especialidadeLabel,
} from "@/services/profissionaisEspecialidades";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalEspecialidade } from "@/types/entities/ProfissionalEspecialidade";
import { ProfissionalEspecialidadeDialog } from "./components/ProfissionalEspecialidadeDialog";

export default function ProfissionaisEspecialidadesPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [list, setList] = useState<ProfissionalEspecialidade[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProfissionalEspecialidade | null>(
    null,
  );
  const [inactivatingId, setInactivatingId] = useState<
    ProfissionalEspecialidade["id"] | null
  >(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const [p, items] = await Promise.all([
        fetchProfissional(id),
        fetchProfissionalEspecialidades(id),
      ]);
      setProfissional(p ?? null);
      setList(items);
    } catch {
      toast.error("Erro ao carregar especialidades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function confirmInactivate() {
    if (!inactivatingId) return;
    try {
      await inactivateProfissionalEspecialidade(inactivatingId);
      toast.success("Especialidade inativada");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar especialidade");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12 text-muted-foreground">
        <Loader2 className="mr-2 size-4 animate-spin" />
        Carregando...
      </div>
    );
  }

  if (!profissional || !id) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Profissional não encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to={`/configuracoes/profissionais/${profissional.id}`}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-1 size-3.5" /> Voltar ao profissional
          </Link>
          <h1 className="text-2xl font-bold">Especialidades do profissional</h1>
          <p className="text-sm text-muted-foreground">{profissional.nome}</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1 size-4" />
          Nova especialidade
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Especialidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Especialidade</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {list.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhuma especialidade vinculada
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="font-medium">
                        {especialidadeLabel(e.especialidadeId)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={e.situacaoId === 1 ? "default" : "secondary"}
                        >
                          {e.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onEdit={() => {
                            setEditing(e);
                            setDialogOpen(true);
                          }}
                          onInactivate={() => setInactivatingId(e.id)}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <ProfissionalEspecialidadeDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profissionalId={id}
        mode={editing ? "edit" : "create"}
        initialData={editing}
        onSaved={load}
      />

      <AlertDialog
        open={!!inactivatingId}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar especialidade?</AlertDialogTitle>
            <AlertDialogDescription>
              O vínculo será marcado como <strong>Inativo</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmInactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
