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
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";

const OPTS_TIPO = [{id:"ENVIO",value:"Envio"},{id:"DEVOLUCAO",value:"Devolução"},{id:"CANCELAMENTO",value:"Cancelamento"},{id:"REENVIO",value:"Reenvio"},{id:"JUSTIFICATIVA",value:"Justificativa"}];

export interface MotivoFormValues {
  nome: string;
  tipo: string | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsMotivo | null;
  onSubmit: (values: MotivoFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsMotivo | null | undefined): MotivoFormValues {
  if (!entity) {
    return {
    nome: "",
    tipo: null,
    };
  }
  return {
      nome: entity.nome ?? "",
      tipo: entity.tipo ?? null,
  };
}

export function MotivoForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<MotivoFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof MotivoFormValues>(key: K, value: MotivoFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.nome && values.nome !== 0) {
      newErrors.nome = true;
      firstError ??= "Nome";
    }
    if (!values.tipo && values.tipo !== 0) {
      newErrors.tipo = true;
      firstError ??= "Tipo";
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
          <Label htmlFor="f-tipo">Tipo *</Label>
          <Select
            value={values.tipo != null ? String(values.tipo) : ""}
            onValueChange={(v) => set("tipo", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-tipo" className={`${errors.tipo ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_TIPO.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
