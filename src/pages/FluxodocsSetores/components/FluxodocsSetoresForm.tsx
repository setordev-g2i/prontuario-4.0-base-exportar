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
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";

const OPTS_RESPONSAVELID = [{id:1,value:"Dr. João Silva"},{id:2,value:"Maria Souza"},{id:3,value:"Carlos Lima"},{id:4,value:"Ana Beatriz"}] as const;

export interface SetoreFormValues {
  nome: string;
  sigla: string;
  cor: string;
  responsavelId: number | null;
  participaFluxo: boolean;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsSetor | null;
  onSubmit: (values: SetoreFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsSetor | null | undefined): SetoreFormValues {
  if (!entity) {
    return {
    nome: "",
    sigla: "",
    cor: "#3b82f6",
    responsavelId: null,
    participaFluxo: true,
    };
  }
  return {
      nome: entity.nome ?? "",
      sigla: entity.sigla ?? "",
      cor: entity.cor ?? "",
      responsavelId: entity.responsavelId ?? null,
      participaFluxo: !!entity.participaFluxo,
  };
}

export function SetoreForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<SetoreFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof SetoreFormValues>(key: K, value: SetoreFormValues[K]) {
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
    if (!values.sigla && values.sigla !== 0) {
      newErrors.sigla = true;
      firstError ??= "Sigla";
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
          <Label htmlFor="f-sigla">Sigla *</Label>
          <Input
            id="f-sigla"
            type="text"
            value={values.sigla ?? ""}
            onChange={(e) => set("sigla", e.target.value)}
            disabled={readOnly}
            className={`${errors.sigla ? " border-destructive" : ""}`}
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
          <Label htmlFor="f-responsavelId">Responsável</Label>
          <Select
            value={values.responsavelId != null ? String(values.responsavelId) : ""}
            onValueChange={(v) => set("responsavelId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-responsavelId" className={`${errors.responsavelId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_RESPONSAVELID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-participaFluxo" className="text-sm">Participa do fluxo</Label>
          <Switch
            id="f-participaFluxo"
            checked={!!values.participaFluxo}
            onCheckedChange={(v) => set("participaFluxo", v)}
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
