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
  ESPECIALIDADE_OPTIONS,
  createProfissionalEspecialidade,
  updateProfissionalEspecialidade,
} from "@/services/profissionaisEspecialidades";
import type { ProfissionalEspecialidade } from "@/types/entities/ProfissionalEspecialidade";

export type ProfissionalEspecialidadeDialogMode = "create" | "edit";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissionalId: string | number;
  mode: ProfissionalEspecialidadeDialogMode;
  initialData?: ProfissionalEspecialidade | null;
  onSaved: () => void;
}

export function ProfissionalEspecialidadeDialog({
  open,
  onOpenChange,
  profissionalId,
  mode,
  initialData,
  onSaved,
}: Props) {
  const [especialidadeId, setEspecialidadeId] = useState("");
  const [situacaoId, setSituacaoId] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setEspecialidadeId(initialData?.especialidadeId ?? "");
      setSituacaoId(initialData?.situacaoId ?? 1);
    }
  }, [open, initialData]);

  async function handleSave() {
    if (!especialidadeId) {
      toast.error("Selecione uma especialidade");
      return;
    }
    setSubmitting(true);
    try {
      if (mode === "edit" && initialData) {
        await updateProfissionalEspecialidade(initialData.id, {
          especialidadeId,
          situacaoId,
        });
        toast.success("Especialidade atualizada");
      } else {
        await createProfissionalEspecialidade({
          profissionalId,
          especialidadeId,
          situacaoId,
        });
        toast.success("Especialidade vinculada");
      }
      onSaved();
      onOpenChange(false);
    } catch {
      toast.error("Erro ao salvar especialidade");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit"
              ? "Editar especialidade"
              : "Nova especialidade"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Atualize a especialidade vinculada ao profissional."
              : "Vincule uma especialidade ao profissional."}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <Label>Especialidade *</Label>
            <Select
              value={especialidadeId}
              onValueChange={setEspecialidadeId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione..." />
              </SelectTrigger>
              <SelectContent>
                {ESPECIALIDADE_OPTIONS.map((e) => (
                  <SelectItem key={e.id} value={e.id}>
                    {e.value}
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
