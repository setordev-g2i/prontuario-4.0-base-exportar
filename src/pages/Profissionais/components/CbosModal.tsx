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
  fetchProfissionalCbos,
  inactivateProfissionalCbo,
  cboLabel,
} from "@/services/profissionaisCbos";
import type { ProfissionalCbo } from "@/types/entities/ProfissionalCbo";
import type { Profissional } from "@/types/entities/Profissional";
import { ProfissionalCboDialog } from "@/pages/ProfissionaisCbos/components/ProfissionalCboDialog";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: Profissional | null;
}

export function CbosModal({ open, onOpenChange, profissional }: Props) {
  const [loading, setLoading] = useState(false);
  const [cbos, setCbos] = useState<ProfissionalCbo[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ProfissionalCbo | null>(null);
  const [inactivatingId, setInactivatingId] = useState<
    ProfissionalCbo["id"] | null
  >(null);

  async function load() {
    if (!profissional) return;
    setLoading(true);
    try {
      const list = await fetchProfissionalCbos(profissional.id);
      setCbos(list);
    } catch {
      toast.error("Erro ao carregar CBOs");
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
      await inactivateProfissionalCbo(inactivatingId);
      toast.success("CBO inativado");
      setInactivatingId(null);
      load();
    } catch {
      toast.error("Erro ao inativar CBO");
    }
  }

  if (!profissional) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>CBOs do profissional</DialogTitle>
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
              Novo CBO
            </Button>
          </div>

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
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : cbos.length === 0 ? (
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
                            setFormOpen(true);
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
        </DialogContent>
      </Dialog>

      <ProfissionalCboDialog
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
    </>
  );
}
