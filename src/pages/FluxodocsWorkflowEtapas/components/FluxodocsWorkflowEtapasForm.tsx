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
import type { FluxodocsWorkflowEtapa } from "@/types/entities/Fluxodocs";

const OPTS_WORKFLOWID = [{id:1,value:"Workflow 1"},{id:2,value:"Workflow 2"},{id:3,value:"Workflow 3"},{id:4,value:"Workflow 4"},{id:5,value:"Workflow 5"}];
const OPTS_STATUSORIGEMID = [{id:1,value:"Aberto"},{id:2,value:"Enviado"},{id:3,value:"Recebido"},{id:4,value:"Devolvido"},{id:5,value:"Aceito Parcial"},{id:6,value:"Reenviado"},{id:7,value:"Cancelado"},{id:8,value:"Finalizado"}];
const OPTS_STATUSDESTINOID = [{id:1,value:"Aberto"},{id:2,value:"Enviado"},{id:3,value:"Recebido"},{id:4,value:"Devolvido"},{id:5,value:"Aceito Parcial"},{id:6,value:"Reenviado"},{id:7,value:"Cancelado"},{id:8,value:"Finalizado"}];
const OPTS_ACAO = [{id:"ENVIAR",value:"Enviar"},{id:"RECEBER",value:"Receber"},{id:"DEVOLVER",value:"Devolver"},{id:"REENVIAR",value:"Reenviar"},{id:"ACEITAR",value:"Aceitar"},{id:"CANCELAR",value:"Cancelar"}];
const OPTS_PERFILPERMITIDO = [{id:"TODOS",value:"Todos"},{id:"AUDITOR",value:"Auditor"},{id:"FATURISTA",value:"Faturista"},{id:"GESTOR",value:"Gestor"}];

export interface WorkflowEtapaFormValues {
  workflowId: number | null;
  statusOrigemId: number | null;
  statusDestinoId: number | null;
  acao: string | null;
  ordem: number | null;
  exigeMotivo: boolean;
  exigeObservacao: boolean;
  permiteReversao: boolean;
  perfilPermitido: string | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsWorkflowEtapa | null;
  onSubmit: (values: WorkflowEtapaFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsWorkflowEtapa | null | undefined): WorkflowEtapaFormValues {
  if (!entity) {
    return {
    workflowId: null,
    statusOrigemId: null,
    statusDestinoId: null,
    acao: null,
    ordem: 1,
    exigeMotivo: false,
    exigeObservacao: false,
    permiteReversao: false,
    perfilPermitido: "TODOS",
    };
  }
  return {
      workflowId: entity.workflowId ?? null,
      statusOrigemId: entity.statusOrigemId ?? null,
      statusDestinoId: entity.statusDestinoId ?? null,
      acao: entity.acao ?? null,
      ordem: entity.ordem ?? null,
      exigeMotivo: !!entity.exigeMotivo,
      exigeObservacao: !!entity.exigeObservacao,
      permiteReversao: !!entity.permiteReversao,
      perfilPermitido: entity.perfilPermitido ?? null,
  };
}

export function WorkflowEtapaForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<WorkflowEtapaFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof WorkflowEtapaFormValues>(key: K, value: WorkflowEtapaFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.workflowId) {
      newErrors.workflowId = true;
      firstError ??= "Workflow";
    }
    if (!values.statusOrigemId) {
      newErrors.statusOrigemId = true;
      firstError ??= "Status de Origem";
    }
    if (!values.statusDestinoId) {
      newErrors.statusDestinoId = true;
      firstError ??= "Status de Destino";
    }
    if (!values.acao) {
      newErrors.acao = true;
      firstError ??= "Ação";
    }
    if (values.ordem === null || values.ordem === undefined) {
      newErrors.ordem = true;
      firstError ??= "Ordem";
    }
    if (!values.perfilPermitido) {
      newErrors.perfilPermitido = true;
      firstError ??= "Perfil permitido";
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
          <Label htmlFor="f-workflowId">Workflow *</Label>
          <Select
            value={values.workflowId != null ? String(values.workflowId) : ""}
            onValueChange={(v) => set("workflowId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-workflowId" className={`${errors.workflowId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_WORKFLOWID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusOrigemId">Status de Origem *</Label>
          <Select
            value={values.statusOrigemId != null ? String(values.statusOrigemId) : ""}
            onValueChange={(v) => set("statusOrigemId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusOrigemId" className={`${errors.statusOrigemId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSORIGEMID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusDestinoId">Status de Destino *</Label>
          <Select
            value={values.statusDestinoId != null ? String(values.statusDestinoId) : ""}
            onValueChange={(v) => set("statusDestinoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusDestinoId" className={`${errors.statusDestinoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSDESTINOID.map((o) => (
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
          <Label htmlFor="f-exigeMotivo" className="text-sm">Exige motivo</Label>
          <Switch
            id="f-exigeMotivo"
            checked={!!values.exigeMotivo}
            onCheckedChange={(v) => set("exigeMotivo", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-exigeObservacao" className="text-sm">Exige observação</Label>
          <Switch
            id="f-exigeObservacao"
            checked={!!values.exigeObservacao}
            onCheckedChange={(v) => set("exigeObservacao", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-permiteReversao" className="text-sm">Permite reversão</Label>
          <Switch
            id="f-permiteReversao"
            checked={!!values.permiteReversao}
            onCheckedChange={(v) => set("permiteReversao", v)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-perfilPermitido">Perfil permitido *</Label>
          <Select
            value={values.perfilPermitido != null ? String(values.perfilPermitido) : ""}
            onValueChange={(v) => set("perfilPermitido", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-perfilPermitido" className={`${errors.perfilPermitido ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_PERFILPERMITIDO.map((o) => (
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
