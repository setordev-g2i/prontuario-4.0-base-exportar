import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Save, Pencil, Trash2, MoreHorizontal, Briefcase } from "lucide-react";
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

export interface ProfissionalCBO {
  id: string;
  medico_responsaveis_id: string;
  cbo_id: string;
  situacao_id: string; // "1" Ativo | "2" Inativo
  user_created: string;
  user_modified: string;
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

export const CBO_OPTIONS = [
  { value: "225125", label: "225125 - Médico Clínico" },
  { value: "225170", label: "225170 - Médico Generalista" },
  { value: "225250", label: "225250 - Médico Ginecologista e Obstetra" },
  { value: "225270", label: "225270 - Médico Ortopedista" },
  { value: "225275", label: "225275 - Médico Otorrinolaringologista" },
  { value: "225280", label: "225280 - Médico Pediatra" },
  { value: "225320", label: "225320 - Médico Psiquiatra" },
  { value: "223505", label: "223505 - Enfermeiro" },
  { value: "223510", label: "223510 - Enfermeiro Auditor" },
  { value: "223515", label: "223515 - Enfermeiro de Estratégia de Saúde da Família" },
];

const SITUACOES = [
  { value: "1", label: "Ativo" },
  { value: "2", label: "Inativo" },
];

const MOCK_USER = "usuario.logado";

/* ───── Helpers ───── */

const nowIso = () => new Date().toISOString();

const formatDate = (iso: string) => {
  if (!iso) return "—";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const cboLabel = (id: string) =>
  CBO_OPTIONS.find((c) => c.value === id)?.label ?? id;

const cboCodigo = (id: string) => id;

const cboDescricao = (id: string) => {
  const lbl = CBO_OPTIONS.find((c) => c.value === id)?.label ?? "";
  return lbl.split(" - ").slice(1).join(" - ");
};

const situacaoLabel = (id: string) =>
  SITUACOES.find((s) => s.value === id)?.label ?? "";

/* ───── Componente ───── */

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: ProfissionalRef | null;
  cbos: ProfissionalCBO[];
  onChange: (cbos: ProfissionalCBO[]) => void;
}

export function ProfissionalCBOsDialog({
  open, onOpenChange, profissional, cbos, onChange,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [cboId, setCboId] = useState("");
  const [situacaoId, setSituacaoId] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const lista = useMemo(
    () => cbos.filter((c) => c.medico_responsaveis_id === profissional?.id),
    [cbos, profissional?.id],
  );

  const resetForm = () => {
    setEditingId(null);
    setCboId("");
    setSituacaoId("");
  };

  const handleNovo = () => {
    resetForm();
  };

  const handleSalvar = () => {
    if (!profissional) return;
    if (!cboId) {
      toast.error("Selecione um CBO");
      return;
    }
    if (!situacaoId) {
      toast.error("Selecione a Situação");
      return;
    }

    // Não permitir duplicar mesmo CBO ativo
    const duplicadoAtivo = lista.find(
      (c) =>
        c.cbo_id === cboId &&
        c.situacao_id === "1" &&
        situacaoId === "1" &&
        c.id !== editingId,
    );
    if (duplicadoAtivo) {
      toast.error("Este CBO já está vinculado e ativo para o profissional");
      return;
    }

    if (editingId) {
      const updated = cbos.map((c) =>
        c.id === editingId
          ? {
              ...c,
              cbo_id: cboId,
              situacao_id: situacaoId,
              modified: nowIso(),
              user_modified: MOCK_USER,
            }
          : c,
      );
      onChange(updated);
      toast.success("CBO atualizado com sucesso");
    } else {
      const novo: ProfissionalCBO = {
        id: `cbo${Date.now()}`,
        medico_responsaveis_id: profissional.id,
        cbo_id: cboId,
        situacao_id: situacaoId,
        user_created: MOCK_USER,
        user_modified: MOCK_USER,
        created: nowIso(),
        modified: nowIso(),
      };
      onChange([...cbos, novo]);
      toast.success("CBO vinculado ao profissional com sucesso");
    }
    resetForm();
  };

  const handleEditar = (c: ProfissionalCBO) => {
    setEditingId(c.id);
    setCboId(c.cbo_id);
    setSituacaoId(c.situacao_id);
    toast("CBO carregado para edição");
  };

  const confirmDelete = () => {
    if (!deletingId) return;
    onChange(cbos.filter((c) => c.id !== deletingId));
    if (editingId === deletingId) resetForm();
    setDeletingId(null);
    toast.success("CBO removido do profissional com sucesso");
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
              <Briefcase className="size-5 text-primary" /> CBOs do Profissional
            </DialogTitle>
            <DialogDescription>
              Gerencie os vínculos de CBO do profissional selecionado.
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
                {editingId ? "Editar vínculo CBO" : "Novo vínculo CBO"}
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
                  CBO <span className="text-destructive">*</span>
                </Label>
                <Select value={cboId} onValueChange={setCboId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o CBO..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CBO_OPTIONS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
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
                  <TableHead className="w-28">CBO</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="w-28">Situação</TableHead>
                  <TableHead className="w-44">Data de Cadastro</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lista.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-20 text-center text-muted-foreground">
                      Nenhum CBO vinculado.
                    </TableCell>
                  </TableRow>
                ) : (
                  lista.map((c) => (
                    <TableRow key={c.id} className={editingId === c.id ? "bg-accent/40" : ""}>
                      <TableCell className="font-mono text-xs">{cboCodigo(c.cbo_id)}</TableCell>
                      <TableCell>{cboDescricao(c.cbo_id) || cboLabel(c.cbo_id)}</TableCell>
                      <TableCell>
                        <Badge variant={c.situacao_id === "1" ? "default" : "secondary"}>
                          {situacaoLabel(c.situacao_id)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {formatDate(c.created)}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="icon" variant="ghost">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => handleEditar(c)}>
                              <Pencil className="size-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setDeletingId(c.id)}
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
            <AlertDialogTitle>Excluir vínculo CBO?</AlertDialogTitle>
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
