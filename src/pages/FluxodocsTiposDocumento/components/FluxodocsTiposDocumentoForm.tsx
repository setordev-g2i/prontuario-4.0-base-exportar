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
import type { FluxodocsTipoDocumento } from "@/types/entities/Fluxodocs";

const OPTS_CATEGORIA = [{id:"FATURAMENTO",value:"Faturamento"},{id:"CLINICO",value:"Clínico"},{id:"ADMINISTRATIVO",value:"Administrativo"}];

export interface TiposDocumentoFormValues {
  nome: string;
  categoria: string | null;
  cor: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsTipoDocumento | null;
  onSubmit: (values: TiposDocumentoFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsTipoDocumento | null | undefined): TiposDocumentoFormValues {
  if (!entity) {
    return {
    nome: "",
    categoria: null,
    cor: "#3b82f6",
    };
  }
  return {
      nome: entity.nome ?? "",
      categoria: entity.categoria ?? null,
      cor: entity.cor ?? "",
  };
}

export function TiposDocumentoForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<TiposDocumentoFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof TiposDocumentoFormValues>(key: K, value: TiposDocumentoFormValues[K]) {
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
    if (!values.categoria) {
      newErrors.categoria = true;
      firstError ??= "Categoria";
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
          <Label htmlFor="f-categoria">Categoria *</Label>
          <Select
            value={values.categoria != null ? String(values.categoria) : ""}
            onValueChange={(v) => set("categoria", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-categoria" className={`${errors.categoria ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_CATEGORIA.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
