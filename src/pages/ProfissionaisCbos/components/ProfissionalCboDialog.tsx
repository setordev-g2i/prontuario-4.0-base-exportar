import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Plus, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CBO_OPTIONS,
  createProfissionalCbo,
  updateProfissionalCbo,
} from "@/services/profissionaisCbos";
import type { ProfissionalCbo } from "@/types/entities/ProfissionalCbo";

export type ProfissionalCboDialogMode = "create" | "edit";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissionalId: string | number;
  mode: ProfissionalCboDialogMode;
  initialData?: ProfissionalCbo | null;
  onSaved: () => void;
}

export function ProfissionalCboDialog({
  open,
  onOpenChange,
  profissionalId,
  mode,
  initialData,
  onSaved,
}: Props) {
  const [cboId, setCboId] = useState("");
  const [situacaoId, setSituacaoId] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCboId(initialData?.cboId ?? "");
      setSituacaoId(initialData?.situacaoId ?? 1);
    }
  }, [open, initialData]);

  async function handleSave() {
    if (!cboId) {
      toast.error("Selecione um CBO");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "edit" && initialData) {
        await updateProfissionalCbo(initialData.id, { cboId, situacaoId });
        toast.success("CBO atualizado");
      } else {
        await createProfissionalCbo({
          profissionalId,
          cboId,
          situacaoId,
        });
        toast.success("CBO vinculado");
      }
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Erro ao salvar CBO");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Editar vínculo CBO" : "Novo vínculo CBO"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize o CBO vinculado ao profissional."
              : "Vincule um CBO ao profissional."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>CBO *</Label>
            <Select value={cboId} onValueChange={setCboId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o CBO..." />
              </SelectTrigger>
              <SelectContent>
                {CBO_OPTIONS.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Situação *</Label>
            <Select
              value={String(situacaoId)}
              onValueChange={(v) => setSituacaoId(Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Ativo</SelectItem>
                <SelectItem value="2">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave} disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : mode === "edit" ? (
              <Save className="mr-1 size-4" />
            ) : (
              <Plus className="mr-1 size-4" />
            )}
            {mode === "edit" ? "Salvar" : "Cadastrar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
