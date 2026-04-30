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
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";

const OPTS_TIPO = [{id:"INICIAL",value:"Inicial"},{id:"FLUXO",value:"Fluxo"},{id:"EXCECAO",value:"Exceção"},{id:"FINAL",value:"Final"}] as const;

export interface StatuFormValues {
  codigo: string;
  nome: string;
  tipo: string | null;
  cor: string;
  ordem: number | null;
  permiteEdicao: boolean;
  finalizador: boolean;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsStatus | null;
  onSubmit: (values: StatuFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsStatus | null | undefined): StatuFormValues {
  if (!entity) {
    return {
    codigo: "",
    nome: "",
    tipo: null,
    cor: #3b82f6,
    ordem: 1,
    permiteEdicao: true,
    finalizador: false,
    };
  }
  return {
      codigo: entity.codigo ?? "",
      nome: entity.nome ?? "",
      tipo: entity.tipo ?? null,
      cor: entity.cor ?? "",
      ordem: entity.ordem ?? null,
      permiteEdicao: !!entity.permiteEdicao,
      finalizador: !!entity.finalizador,
  };
}

export function StatuForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<StatuFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof StatuFormValues>(key: K, value: StatuFormValues[K]) {
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
    if (!values.tipo && values.tipo !== 0) {
      newErrors.tipo = true;
      firstError ??= "Tipo";
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
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-permiteEdicao" className="text-sm">Permite Edição</Label>
          <Switch
            id="f-permiteEdicao"
            checked={!!values.permiteEdicao}
            onCheckedChange={(v) => set("permiteEdicao", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-finalizador" className="text-sm">Finalizador</Label>
          <Switch
            id="f-finalizador"
            checked={!!values.finalizador}
            onCheckedChange={(v) => set("finalizador", v)}
            disabled={readOnly}
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
