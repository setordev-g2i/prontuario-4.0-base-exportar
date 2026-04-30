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
import type { FluxodocsLog } from "@/types/entities/Fluxodocs";

const OPTS_PROTOCOLOID = Array.from({length:8},(_,i)=>({id:i+1,value:`Protocolo ${i+1}`})) as const;
const OPTS_USUARIOID = [{id:1,value:"Dr. João Silva"},{id:2,value:"Maria Souza"},{id:3,value:"Carlos Lima"},{id:4,value:"Ana Beatriz"}] as const;
const OPTS_SETORID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}] as const;
const OPTS_ACAO = [{id:"CRIADO",value:"Criado"},{id:"ENVIADO",value:"Enviado"},{id:"RECEBIDO",value:"Recebido"},{id:"DEVOLVIDO",value:"Devolvido"},{id:"REENVIADO",value:"Reenviado"},{id:"CANCELADO",value:"Cancelado"},{id:"DOCUMENTO_ANEXADO",value:"Documento anexado"}] as const;

export interface LogFormValues {
  protocoloId: number | null;
  usuarioId: number | null;
  setorId: number | null;
  acao: string | null;
  payload: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsLog | null;
  onSubmit: (values: LogFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsLog | null | undefined): LogFormValues {
  if (!entity) {
    return {
    protocoloId: null,
    usuarioId: null,
    setorId: null,
    acao: null,
    payload: "",
    };
  }
  return {
      protocoloId: entity.protocoloId ?? null,
      usuarioId: entity.usuarioId ?? null,
      setorId: entity.setorId ?? null,
      acao: entity.acao ?? null,
      payload: entity.payload ?? "",
  };
}

export function LogForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<LogFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof LogFormValues>(key: K, value: LogFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.acao && values.acao !== 0) {
      newErrors.acao = true;
      firstError ??= "Ação";
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
          <Label htmlFor="f-protocoloId">Protocolo</Label>
          <Select
            value={values.protocoloId != null ? String(values.protocoloId) : ""}
            onValueChange={(v) => set("protocoloId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-protocoloId" className={`${errors.protocoloId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_PROTOCOLOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-usuarioId">Usuário</Label>
          <Select
            value={values.usuarioId != null ? String(values.usuarioId) : ""}
            onValueChange={(v) => set("usuarioId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-usuarioId" className={`${errors.usuarioId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_USUARIOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-setorId">Setor</Label>
          <Select
            value={values.setorId != null ? String(values.setorId) : ""}
            onValueChange={(v) => set("setorId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-setorId" className={`${errors.setorId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_SETORID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-acao">Ação *</Label>
          <Select
            value={values.acao != null ? String(values.acao) : ""}
            onValueChange={(v) => set("acao", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-acao" className={`${errors.acao ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_ACAO.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-payload">Payload</Label>
          <Textarea
            id="f-payload"
            value={values.payload ?? ""}
            onChange={(e) => set("payload", e.target.value)}
            disabled={readOnly}
            className={`${errors.payload ? " border-destructive" : ""}`}
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
