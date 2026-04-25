import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Pencil, Trash2, MoreHorizontal, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Table, TableHeader, TableBody, TableRow, TableHead, TableCell,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/* ───── Tipos ───── */

export interface ProfissionalEspecialidade {
  id: string;
  medico_id: string;
  especialidade_id: string;
  situacao_id: string; // "1" Ativo | "2" Inativo
  created: string;
  modified: string;
}

interface ProfissionalRef {
  id: string;
  nome: string;
  cpf: string;
  tipo_cadastro_label: string;
  conselho?: string;
}

/* ───── Constantes ───── */

export const ESPECIALIDADE_OPTIONS = [
  { value: "1", label: "Clínica Médica" },
  { value: "2", label: "Cardiologia" },
  { value: "3", label: "Ortopedia" },
  { value: "4", label: "Pediatria" },
  { value: "5", label: "Ginecologia e Obstetrícia" },
  { value: "6", label: "Psiquiatria" },
  { value: "7", label: "Dermatologia" },
  { value: "8", label: "Neurologia" },
  { value: "9", label: "Enfermagem Geral" },
  { value: "10", label: "Enfermagem UTI" },
];

const SITUACOES = [
  { value: "1", label: "Ativo" },
  { value: "2", label: "Inativo" },
];

/* ───── Helpers ───── */

const nowIso = () => new Date().toISOString();

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const especialidadeLabel = (id: string) =>
  ESPECIALIDADE_OPTIONS.find((e) => e.value === id)?.label ?? id;

const situacaoLabel = (id: string) =>
  SITUACOES.find((s) => s.value === id)?.label ?? "";

/* ───── Componente ───── */

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: ProfissionalRef | null;
  especialidades: ProfissionalEspecialidade[];
  onChange: (especialidades: ProfissionalEspecialidade[]) => void;
}

export function ProfissionalEspecialidadesDialog({
  open, onOpenChange, profissional, especialidades, onChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [situacaoId, setSituacaoId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const lista = useMemo(
    () => especialidades.filter((e) => e.medico_id === profissional?.id),
    [especialidades, profissional?.id],
  );

  const resetForm = () => {
    setEditingId(null);
    setEspecialidadeId("");
    setSituacaoId("");
  };

  const handleNovo = () => {
    resetForm();
  };

  const handleSalvar = () => {
    if (!profissional) return;
    if (!especialidadeId) {
      toast.error("Selecione uma Especialidade");
      return;
    }
    if (!situacaoId) {
      toast.error("Selecione a Situação");
      return;
    }

    const duplicadoAtivo = lista.find(
      (e) =>
        e.especialidade_id === especialidadeId &&
        e.situacao_id === "1" &&
        situacaoId === "1" &&
        e.id !== editingId,
    );
    if (duplicadoAtivo) {
      toast.error("Esta especialidade já está vinculada e ativa para o profissional");
      return;
    }

    if (editingId) {
      const updated = especialidades.map((e) =>
        e.id === editingId
          ? {
              ...e,
              especialidade_id: especialidadeId,
              situacao_id: situacaoId,
              modified: nowIso(),
            }
          : e,
      );
      onChange(updated);
      toast.success("Especialidade atualizada com sucesso");
    } else {
      const novo: ProfissionalEspecialidade = {
        id: `esp${Date.now()}`,
        medico_id: profissional.id,
        especialidade_id: especialidadeId,
        situacao_id: situacaoId,
        created: nowIso(),
        modified: nowIso(),
      };
      onChange([...especialidades, novo]);
      toast.success("Especialidade vinculada com sucesso");
    }
    resetForm();
  };

  const handleEditar = (e: ProfissionalEspecialidade) => {
    setEditingId(e.id);
    setEspecialidadeId(e.especialidade_id);
    setSituacaoId(e.situacao_id);
    toast("Especialidade carregada para edição");
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    onChange(especialidades.filter((e) => e.id !== deletingId));
    if (editingId === deletingId) resetForm();
    setDeletingId(null);
    toast.success("Especialidade removida com sucesso");
  };

  const handleClose = (o: boolean) => {
    if (!o) resetForm();
    onOpenChange(o);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Stethoscope className="size-5 text-primary" /> Especialidades do Profissional
            </DialogTitle>
            <DialogDescription>
              Gerencie as especialidades vinculadas ao profissional selecionado.
            </DialogDescription>
          </DialogHeader>

          {/* Cabeçalho do profissional */}
          {profissional && (
            <div className="rounded-md border bg-muted/30 p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
              <div>
                <div className="text-xs text-muted-foreground">Nome</div>
                <div className="font-medium">{profissional.nome}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">CPF</div>
                <div className="font-mono">{profissional.cpf || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Tipo de Cadastro</div>
                <div>{profissional.tipo_cadastro_label || "—"}</div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Conselho</div>
                <div>{profissional.conselho || "—"}</div>
              </div>
            </div>
          )}

          {/* Formulário */}
          <div className="space-y-3 rounded-md border p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">
                {editingId ? "Editar especialidade" : "Nova especialidade"}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleNovo}>
                  <Plus className="size-4" /> Novo
                </Button>
                <Button size="sm" onClick={handleSalvar}>
                  <Save className="size-4" /> Salvar
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  Especialidade <span className="text-destructive">*</span>
                </Label>
                <Select value={especialidadeId} onValueChange={setEspecialidadeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a especialidade..." />
                  </SelectTrigger>
                  <SelectContent>
                    {ESPECIALIDADE_OPTIONS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1">
                  Situação <span className="text-destructive">*</span>
                </Label>
                <Select value={situacaoId} onValueChange={setSituacaoId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    {SITUACOES.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.value} - {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Listagem */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Especialidade</TableHead>
                  <TableHead className="w-28">Situação</TableHead>
                  <TableHead className="w-44">Data de Cadastro</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-20 text-center text-muted-foreground">
                      Nenhuma especialidade vinculada.
                    </TableCell>
                  </TableRow>
                ) : (
                  lista.map((e) => (
                    <TableRow key={e.id} className={editingId === e.id ? "bg-accent/40" : ""}>
                      <TableCell className="font-medium">
                        {especialidadeLabel(e.especialidade_id)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={e.situacao_id === "1" ? "default" : "secondary"}>
                          {situacaoLabel(e.situacao_id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(e.created)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => handleEditar(e)}>
                              <Pencil className="size-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingId(e.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="size-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deletingId} onOpenChange={(o) => !o && setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir especialidade?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
