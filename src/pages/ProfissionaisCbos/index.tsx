import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import { BackButton } from "@/components/BackButton";
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
  fetchProfissionalCbos,
  inactivateProfissionalCbo,
  cboLabel,
} from "@/services/profissionaisCbos";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalCbo } from "@/types/entities/ProfissionalCbo";
import { ProfissionalCboDialog } from "./components/ProfissionalCboDialog";

export default function ProfissionaisCbosPage() {
  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [profissional, setProfissional] = useState<Profissional | null>(null);
  const [cbos, setCbos] = useState<ProfissionalCbo[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<ProfissionalCbo | null>(null);
  const [inactivatingId, setInactivatingId] = useState<
    ProfissionalCbo["id"] | null
  >(null);

  async function load() {
    if (!id) return;
    setLoading(true);
    try {
      const [p, list] = await Promise.all([
        fetchProfissional(id),
        fetchProfissionalCbos(id),
      ]);
      setProfissional(p ?? null);
      setCbos(list);
    } catch {
      toast.error("Erro ao carregar CBOs");
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
      await inactivateProfissionalCbo(inactivatingId);
      toast.success("CBO inativado");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar CBO");
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
          <h1 className="text-2xl font-bold">CBOs do profissional</h1>
          <p className="text-sm text-muted-foreground">{profissional.nome}</p>
        </div>
        <Button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
        >
          <Plus className="mr-1 size-4" />
          Novo CBO
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Vínculos CBO</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {cbos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center py-8 text-muted-foreground"
                    >
                      Nenhum CBO vinculado
                    </TableCell>
                  </TableRow>
                ) : (
                  cbos.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs">
                        {c.cboId}
                      </TableCell>
                      <TableCell>
                        {cboLabel(c.cboId).split(" - ").slice(1).join(" - ") ||
                          cboLabel(c.cboId)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={c.situacaoId === 1 ? "default" : "secondary"}
                        >
                          {c.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onEdit={() => {
                            setEditing(c);
                            setDialogOpen(true);
                          }}
                          onInactivate={() => setInactivatingId(c.id)}
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

      <ProfissionalCboDialog
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
            <AlertDialogTitle>Inativar CBO?</AlertDialogTitle>
            <AlertDialogDescription>
              O vínculo CBO será marcado como <strong>Inativo</strong>.
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
