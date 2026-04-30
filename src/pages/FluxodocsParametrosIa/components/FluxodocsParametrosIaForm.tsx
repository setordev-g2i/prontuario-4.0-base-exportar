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
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";



export interface ParametrosIaFormValues {
  nome: string;
  chave: string;
  valor: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsParametroIa | null;
  onSubmit: (values: ParametrosIaFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsParametroIa | null | undefined): ParametrosIaFormValues {
  if (!entity) {
    return {
    nome: "",
    chave: "",
    valor: "",
    };
  }
  return {
      nome: entity.nome ?? "",
      chave: entity.chave ?? "",
      valor: entity.valor ?? "",
  };
}

export function ParametrosIaForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<ParametrosIaFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ParametrosIaFormValues>(key: K, value: ParametrosIaFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.nome) {
      newErrors.nome = true;
      firstError ??= "Nome";
    }
    if (!values.chave) {
      newErrors.chave = true;
      firstError ??= "Chave";
    }
    if (!values.valor) {
      newErrors.valor = true;
      firstError ??= "Valor";
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
          <Label htmlFor="f-chave">Chave *</Label>
          <Input
            id="f-chave"
            type="text"
            value={values.chave ?? ""}
            onChange={(e) => set("chave", e.target.value)}
            disabled={readOnly}
            className={`${errors.chave ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-valor">Valor *</Label>
          <Input
            id="f-valor"
            type="text"
            value={values.valor ?? ""}
            onChange={(e) => set("valor", e.target.value)}
            disabled={readOnly}
            className={`${errors.valor ? " border-destructive" : ""}`}
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
