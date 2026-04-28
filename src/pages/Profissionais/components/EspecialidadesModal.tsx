import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import {
  fetchProfissionalEspecialidades,
  inactivateProfissionalEspecialidade,
  especialidadeLabel,
} from "@/services/profissionaisEspecialidades";
import type { ProfissionalEspecialidade } from "@/types/entities/ProfissionalEspecialidade";
import type { Profissional } from "@/types/entities/Profissional";
import { ProfissionalEspecialidadeDialog } from "@/pages/ProfissionaisEspecialidades/components/ProfissionalEspecialidadeDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: Profissional | null;
}

export function EspecialidadesModal({ open, onOpenChange, profissional }: Props) {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ProfissionalEspecialidade[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProfissionalEspecialidade | null>(null);
  const [inactivatingId, setInactivatingId] = useState<
    ProfissionalEspecialidade["id"] | null
  >(null);

  async function load() {
    if (!profissional) return;
    setLoading(true);
    try {
      const items = await fetchProfissionalEspecialidades(profissional.id);
      setList(items);
    } catch {
      toast.error("Erro ao carregar especialidades");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open && profissional) {
      load();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profissional?.id]);

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

  if (!profissional) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Especialidades do profissional</DialogTitle>
            <DialogDescription>{profissional.nome}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={() => {
                setEditing(null);
                setFormOpen(true);
              }}
            >
              <Plus className="mr-1 size-4" />
              Nova especialidade
            </Button>
          </div>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : list.length === 0 ? (
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
                            setFormOpen(true);
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
        </DialogContent>
      </Dialog>

      <ProfissionalEspecialidadeDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        profissionalId={profissional.id}
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
    </>
  );
}
