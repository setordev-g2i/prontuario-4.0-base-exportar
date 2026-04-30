import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FluxodocsPrioridade } from "@/types/entities/Fluxodocs";



export interface PrioridadeFormValues {
  codigo: string;
  nome: string;
  peso: number | null;
  cor: string;
  ordem: number | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsPrioridade | null;
  onSubmit: (values: PrioridadeFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsPrioridade | null | undefined): PrioridadeFormValues {
  if (!entity) {
    return {
    codigo: "",
    nome: "",
    peso: 1,
    cor: "#3b82f6",
    ordem: 1,
    };
  }
  return {
      codigo: entity.codigo ?? "",
      nome: entity.nome ?? "",
      peso: entity.peso ?? null,
      cor: entity.cor ?? "",
      ordem: entity.ordem ?? null,
  };
}

export function PrioridadeForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<PrioridadeFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof PrioridadeFormValues>(key: K, value: PrioridadeFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.codigo && values.codigo !== 0) {
      newErrors.codigo = true;
      firstError ??= "Código";
    }
    if (!values.nome && values.nome !== 0) {
      newErrors.nome = true;
      firstError ??= "Nome";
    }
    if (values.peso === null || values.peso === undefined) {
      newErrors.peso = true;
      firstError ??= "Peso";
    }
    if (values.ordem === null || values.ordem === undefined) {
      newErrors.ordem = true;
      firstError ??= "Ordem";
    }
    if (firstError) {
      setErrors(newErrors);
      toast.error(`O campo ${firstError} é obrigatório`);
      return;
    }
    onSubmit(values);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="f-codigo">Código *</Label>
          <Input
            id="f-codigo"
            type="text"
            value={values.codigo ?? ""}
            onChange={(e) => set("codigo", e.target.value)}
            disabled={readOnly}
            className={`${errors.codigo ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-nome">Nome *</Label>
          <Input
            id="f-nome"
            type="text"
            value={values.nome ?? ""}
            onChange={(e) => set("nome", e.target.value)}
            disabled={readOnly}
            className={`${errors.nome ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-peso">Peso *</Label>
          <Input
            id="f-peso"
            type="number"
            value={values.peso ?? ""}
            onChange={(e) => set("peso", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.peso ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-cor">Cor</Label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              id="f-cor"
              value={values.cor || "#3b82f6"}
              onChange={(e) => set("cor", e.target.value)}
              disabled={readOnly}
              className="h-9 w-12 cursor-pointer rounded border"
            />
            <Input
              value={values.cor ?? ""}
              onChange={(e) => set("cor", e.target.value)}
              placeholder="#000000"
              disabled={readOnly}
              className={`${errors.cor ? " border-destructive" : ""}`}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-ordem">Ordem *</Label>
          <Input
            id="f-ordem"
            type="number"
            value={values.ordem ?? ""}
            onChange={(e) => set("ordem", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.ordem ? " border-destructive" : ""}`}
          />
        </div>
      </div>

      {!readOnly && (
        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {mode === "create" ? "Cadastrar" : "Salvar"}
          </Button>
        </div>
      )}
      {readOnly && (
        <div className="flex justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Fechar
          </Button>
        </div>
      )}
    </form>
  );
}
