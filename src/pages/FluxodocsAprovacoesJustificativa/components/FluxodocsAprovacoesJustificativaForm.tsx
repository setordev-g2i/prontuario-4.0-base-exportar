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
import type { FluxodocsAprovacaoJustificativa } from "@/types/entities/Fluxodocs";

const OPTS_CHECKLISTID = Array.from({length:22},(_,i)=>({id:i+1,value:`Checklist #${i+1}`}));
const OPTS_PROTOCOLOID = Array.from({length:8},(_,i)=>({id:i+1,value:`Protocolo ${i+1}`}));
const OPTS_ITEMID = Array.from({length:8},(_,i)=>({id:i+1,value:`Item ${i+1}`}));
const OPTS_STATUSAPROVACAO = [{id:"PENDENTE",value:"Pendente"},{id:"APROVADO",value:"Aprovado"},{id:"REPROVADO",value:"Reprovado"},{id:"CANCELADO",value:"Cancelado"}];
const OPTS_SOLICITADOPORID = [{id:1,value:"Dr. João Silva"},{id:2,value:"Maria Souza"},{id:3,value:"Carlos Lima"},{id:4,value:"Ana Beatriz"}];
const OPTS_APROVADOPORID = [{id:1,value:"Dr. João Silva"},{id:2,value:"Maria Souza"},{id:3,value:"Carlos Lima"},{id:4,value:"Ana Beatriz"}];

export interface AprovacoesJustificativaFormValues {
  checklistId: number | null;
  protocoloId: number | null;
  itemId: number | null;
  justificativa: string;
  statusAprovacao: string | null;
  solicitadoPorId: number | null;
  solicitadoEm: string;
  aprovadoPorId: number | null;
  aprovadoEm: string;
  observacaoAprovador: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsAprovacaoJustificativa | null;
  onSubmit: (values: AprovacoesJustificativaFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsAprovacaoJustificativa | null | undefined): AprovacoesJustificativaFormValues {
  if (!entity) {
    return {
    checklistId: null,
    protocoloId: null,
    itemId: null,
    justificativa: "",
    statusAprovacao: "PENDENTE",
    solicitadoPorId: null,
    solicitadoEm: "",
    aprovadoPorId: null,
    aprovadoEm: "",
    observacaoAprovador: "",
    };
  }
  return {
      checklistId: entity.checklistId ?? null,
      protocoloId: entity.protocoloId ?? null,
      itemId: entity.itemId ?? null,
      justificativa: entity.justificativa ?? "",
      statusAprovacao: entity.statusAprovacao ?? null,
      solicitadoPorId: entity.solicitadoPorId ?? null,
      solicitadoEm: entity.solicitadoEm ?? "",
      aprovadoPorId: entity.aprovadoPorId ?? null,
      aprovadoEm: entity.aprovadoEm ?? "",
      observacaoAprovador: entity.observacaoAprovador ?? "",
  };
}

export function AprovacoesJustificativaForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<AprovacoesJustificativaFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof AprovacoesJustificativaFormValues>(key: K, value: AprovacoesJustificativaFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.checklistId) {
      newErrors.checklistId = true;
      firstError ??= "Checklist";
    }
    if (!values.protocoloId) {
      newErrors.protocoloId = true;
      firstError ??= "Protocolo";
    }
    if (!values.justificativa) {
      newErrors.justificativa = true;
      firstError ??= "Justificativa";
    }
    if (!values.statusAprovacao) {
      newErrors.statusAprovacao = true;
      firstError ??= "Status da Aprovação";
    }
    if (!values.solicitadoPorId) {
      newErrors.solicitadoPorId = true;
      firstError ??= "Solicitado por";
    }
    if (!values.solicitadoEm) {
      newErrors.solicitadoEm = true;
      firstError ??= "Solicitado em";
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
          <Label htmlFor="f-checklistId">Checklist *</Label>
          <Select
            value={values.checklistId != null ? String(values.checklistId) : ""}
            onValueChange={(v) => set("checklistId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-checklistId" className={`${errors.checklistId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_CHECKLISTID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-protocoloId">Protocolo *</Label>
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
          <Label htmlFor="f-itemId">Item</Label>
          <Select
            value={values.itemId != null ? String(values.itemId) : ""}
            onValueChange={(v) => set("itemId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-itemId" className={`${errors.itemId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_ITEMID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-justificativa">Justificativa *</Label>
          <Textarea
            id="f-justificativa"
            value={values.justificativa ?? ""}
            onChange={(e) => set("justificativa", e.target.value)}
            disabled={readOnly}
            className={`${errors.justificativa ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusAprovacao">Status da Aprovação *</Label>
          <Select
            value={values.statusAprovacao != null ? String(values.statusAprovacao) : ""}
            onValueChange={(v) => set("statusAprovacao", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusAprovacao" className={`${errors.statusAprovacao ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSAPROVACAO.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-solicitadoPorId">Solicitado por *</Label>
          <Select
            value={values.solicitadoPorId != null ? String(values.solicitadoPorId) : ""}
            onValueChange={(v) => set("solicitadoPorId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-solicitadoPorId" className={`${errors.solicitadoPorId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_SOLICITADOPORID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-solicitadoEm">Solicitado em *</Label>
          <Input
            id="f-solicitadoEm"
            type="datetime-local"
            value={values.solicitadoEm ? values.solicitadoEm.slice(0, 16) : ""}
            onChange={(e) => set("solicitadoEm", e.target.value ? new Date(e.target.value).toISOString() : "")}
            disabled={readOnly}
            className={`${errors.solicitadoEm ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-aprovadoPorId">Aprovado por</Label>
          <Select
            value={values.aprovadoPorId != null ? String(values.aprovadoPorId) : ""}
            onValueChange={(v) => set("aprovadoPorId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-aprovadoPorId" className={`${errors.aprovadoPorId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_APROVADOPORID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-aprovadoEm">Aprovado em</Label>
          <Input
            id="f-aprovadoEm"
            type="datetime-local"
            value={values.aprovadoEm ? values.aprovadoEm.slice(0, 16) : ""}
            onChange={(e) => set("aprovadoEm", e.target.value ? new Date(e.target.value).toISOString() : "")}
            disabled={readOnly}
            className={`${errors.aprovadoEm ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-observacaoAprovador">Observação do aprovador</Label>
          <Textarea
            id="f-observacaoAprovador"
            value={values.observacaoAprovador ?? ""}
            onChange={(e) => set("observacaoAprovador", e.target.value)}
            disabled={readOnly}
            className={`${errors.observacaoAprovador ? " border-destructive" : ""}`}
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
