import { useEffect, useState, useMemo } from "react";
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
  convenioLabel,
  fetchProdutividades,
  inactivateProdutividade,
} from "@/services/profissionaisProdutividade";
import { fetchProcedimentos } from "@/services/procedimentos";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalProdutividade } from "@/types/entities/ProfissionalProdutividade";
import type { Procedimento } from "@/types/entities/Procedimento";
import {
  ProdutividadeFormModal,
  type ProdutividadeFormMode,
} from "./ProdutividadeFormModal";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: Profissional | null;
}

export function ProdutividadeModal({ open, onOpenChange, profissional }: Props) {
  const [list, setList] = useState<ProfissionalProdutividade[]>([]);
  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [loading, setLoading] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<ProdutividadeFormMode>("create");
  const [selected, setSelected] =
    useState<ProfissionalProdutividade | null>(null);

  const [inactivatingId, setInactivatingId] = useState<
    string | number | null
  >(null);

  async function load() {
    if (!profissional) return;
    setLoading(true);
    try {
      const [items, procs] = await Promise.all([
        fetchProdutividades(profissional.id),
        fetchProcedimentos(),
      ]);
      setList(items);
      setProcedimentos(procs);
    } catch {
      toast.error("Erro ao carregar produtividade");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profissional?.id]);

  const procedimentoLabel = useMemo(() => {
    const map = new Map(procedimentos.map((p) => [p.id, p.nome]));
    return (id: number) => map.get(id) ?? String(id);
  }, [procedimentos]);

  function openForm(mode: ProdutividadeFormMode, item: ProfissionalProdutividade | null) {
    setFormMode(mode);
    setSelected(item);
    setFormOpen(true);
  }

  async function confirmInactivate() {
    if (!inactivatingId) return;
    try {
      await inactivateProdutividade(inactivatingId);
      toast.success("Registro inativado com sucesso");
      setInactivatingId(null);
      await load();
    } catch {
      toast.error("Erro ao inativar registro");
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produtividade do Profissional</DialogTitle>
            <DialogDescription>
              {profissional ? (
                <span>
                  Profissional: <strong>{profissional.nome}</strong>
                </span>
              ) : (
                "Selecione um profissional"
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end">
            <Button onClick={() => openForm("create", null)} disabled={!profissional}>
              <Plus className="mr-1 size-4" />
              Novo
            </Button>
          </div>

          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Vl. Fixo</TableHead>
                  <TableHead>% Recebimento</TableHead>
                  <TableHead>% Imposto</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nenhuma produtividade cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{convenioLabel(p.convenioId)}</TableCell>
                      <TableCell>{procedimentoLabel(p.procedimentoId)}</TableCell>
                      <TableCell>
                        {p.vlFixo != null
                          ? `R$ ${Number(p.vlFixo).toFixed(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {p.percRecebimento != null
                          ? `${p.percRecebimento}%`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {p.percImposto != null ? `${p.percImposto}%` : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.vigenciaInicial
                          ? new Date(p.vigenciaInicial).toLocaleDateString("pt-BR")
                          : "—"}
                        {p.vigenciaFinal
                          ? ` a ${new Date(p.vigenciaFinal).toLocaleDateString("pt-BR")}`
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Badge variant={p.situacaoId === 1 ? "default" : "secondary"}>
                          {p.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onView={() => openForm("view", p)}
                          onEdit={() => openForm("edit", p)}
                          onInactivate={() => setInactivatingId(p.id)}
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

      <ProdutividadeFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        profissional={profissional}
        mode={formMode}
        initial={selected}
        onSaved={load}
      />

      <AlertDialog
        open={!!inactivatingId}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar produtividade?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro será marcado como <strong>Inativo</strong>.
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
