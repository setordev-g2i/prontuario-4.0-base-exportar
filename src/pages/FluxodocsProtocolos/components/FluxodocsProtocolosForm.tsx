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
import type { FluxodocsProtocolo } from "@/types/entities/Fluxodocs";

const OPTS_TIPOMOVIMENTACAOID = [{id:1,value:"ENVIO"},{id:2,value:"REMESSA"},{id:3,value:"DEVOLUCAO"},{id:4,value:"REENVIO"},{id:5,value:"INTERNO"},{id:6,value:"RECEBIMENTO_MANUAL"}];
const OPTS_SETORORIGEMID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}];
const OPTS_SETORDESTINOID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}];
const OPTS_PRIORIDADEID = [{id:1,value:"Normal"},{id:2,value:"Alta"},{id:3,value:"Urgente"}];
const OPTS_MOTIVOID = [{id:1,value:"Envio para auditoria"},{id:2,value:"Documento ilegível"},{id:3,value:"Falta de assinatura"},{id:4,value:"Falta carteirinha"},{id:5,value:"CID inconsistente"},{id:6,value:"Procedimento divergente"}];
const OPTS_STATUSID = [{id:1,value:"Aberto"},{id:2,value:"Enviado"},{id:3,value:"Recebido"},{id:4,value:"Devolvido"},{id:5,value:"Aceito Parcial"},{id:6,value:"Reenviado"},{id:7,value:"Cancelado"},{id:8,value:"Finalizado"}];
const OPTS_SLASTATUS = [{id:"NO_PRAZO",value:"No prazo"},{id:"ATRASADO",value:"Atrasado"},{id:"EM_RISCO",value:"Em risco"}];

export interface ProtocoloFormValues {
  numero: string;
  tipoMovimentacaoId: number | null;
  setorOrigemId: number | null;
  setorDestinoId: number | null;
  prioridadeId: number | null;
  motivoId: number | null;
  statusId: number | null;
  observacao: string;
  slaPrevistoEm: string;
  slaRealizadoEm: string;
  slaStatus: string | null;
  iaRiscoAtraso: number | null;
  iaScoreComplexidade: number | null;
  iaScorePrioridade: number | null;
  iaRecomendacao: string;
  ordemFila: number | null;
  protocoloOrigemId: number | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsProtocolo | null;
  onSubmit: (values: ProtocoloFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsProtocolo | null | undefined): ProtocoloFormValues {
  if (!entity) {
    return {
    numero: "",
    tipoMovimentacaoId: null,
    setorOrigemId: null,
    setorDestinoId: null,
    prioridadeId: null,
    motivoId: null,
    statusId: null,
    observacao: "",
    slaPrevistoEm: "",
    slaRealizadoEm: "",
    slaStatus: null,
    iaRiscoAtraso: null,
    iaScoreComplexidade: null,
    iaScorePrioridade: null,
    iaRecomendacao: "",
    ordemFila: null,
    protocoloOrigemId: null,
    };
  }
  return {
      numero: entity.numero ?? "",
      tipoMovimentacaoId: entity.tipoMovimentacaoId ?? null,
      setorOrigemId: entity.setorOrigemId ?? null,
      setorDestinoId: entity.setorDestinoId ?? null,
      prioridadeId: entity.prioridadeId ?? null,
      motivoId: entity.motivoId ?? null,
      statusId: entity.statusId ?? null,
      observacao: entity.observacao ?? "",
      slaPrevistoEm: entity.slaPrevistoEm ?? "",
      slaRealizadoEm: entity.slaRealizadoEm ?? "",
      slaStatus: entity.slaStatus ?? null,
      iaRiscoAtraso: entity.iaRiscoAtraso ?? null,
      iaScoreComplexidade: entity.iaScoreComplexidade ?? null,
      iaScorePrioridade: entity.iaScorePrioridade ?? null,
      iaRecomendacao: entity.iaRecomendacao ?? "",
      ordemFila: entity.ordemFila ?? null,
      protocoloOrigemId: entity.protocoloOrigemId ?? null,
  };
}

export function ProtocoloForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<ProtocoloFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ProtocoloFormValues>(key: K, value: ProtocoloFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.numero) {
      newErrors.numero = true;
      firstError ??= "Número";
    }
    if (!values.tipoMovimentacaoId) {
      newErrors.tipoMovimentacaoId = true;
      firstError ??= "Tipo de Movimentação";
    }
    if (!values.setorOrigemId) {
      newErrors.setorOrigemId = true;
      firstError ??= "Setor de Origem";
    }
    if (!values.setorDestinoId) {
      newErrors.setorDestinoId = true;
      firstError ??= "Setor de Destino";
    }
    if (!values.prioridadeId) {
      newErrors.prioridadeId = true;
      firstError ??= "Prioridade";
    }
    if (!values.statusId) {
      newErrors.statusId = true;
      firstError ??= "Status";
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
          <Label htmlFor="f-numero">Número *</Label>
          <Input
            id="f-numero"
            type="text"
            value={values.numero ?? ""}
            onChange={(e) => set("numero", e.target.value)}
            disabled={readOnly}
            className={`${errors.numero ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-tipoMovimentacaoId">Tipo de Movimentação *</Label>
          <Select
            value={values.tipoMovimentacaoId != null ? String(values.tipoMovimentacaoId) : ""}
            onValueChange={(v) => set("tipoMovimentacaoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-tipoMovimentacaoId" className={`${errors.tipoMovimentacaoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_TIPOMOVIMENTACAOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-setorOrigemId">Setor de Origem *</Label>
          <Select
            value={values.setorOrigemId != null ? String(values.setorOrigemId) : ""}
            onValueChange={(v) => set("setorOrigemId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-setorOrigemId" className={`${errors.setorOrigemId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_SETORORIGEMID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-setorDestinoId">Setor de Destino *</Label>
          <Select
            value={values.setorDestinoId != null ? String(values.setorDestinoId) : ""}
            onValueChange={(v) => set("setorDestinoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-setorDestinoId" className={`${errors.setorDestinoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_SETORDESTINOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-prioridadeId">Prioridade *</Label>
          <Select
            value={values.prioridadeId != null ? String(values.prioridadeId) : ""}
            onValueChange={(v) => set("prioridadeId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-prioridadeId" className={`${errors.prioridadeId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_PRIORIDADEID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-motivoId">Motivo</Label>
          <Select
            value={values.motivoId != null ? String(values.motivoId) : ""}
            onValueChange={(v) => set("motivoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-motivoId" className={`${errors.motivoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_MOTIVOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusId">Status *</Label>
          <Select
            value={values.statusId != null ? String(values.statusId) : ""}
            onValueChange={(v) => set("statusId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusId" className={`${errors.statusId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-observacao">Observação</Label>
          <Textarea
            id="f-observacao"
            value={values.observacao ?? ""}
            onChange={(e) => set("observacao", e.target.value)}
            disabled={readOnly}
            className={`${errors.observacao ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-slaPrevistoEm">SLA Previsto em</Label>
          <Input
            id="f-slaPrevistoEm"
            type="datetime-local"
            value={values.slaPrevistoEm ? values.slaPrevistoEm.slice(0, 16) : ""}
            onChange={(e) => set("slaPrevistoEm", e.target.value ? new Date(e.target.value).toISOString() : "")}
            disabled={readOnly}
            className={`${errors.slaPrevistoEm ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-slaRealizadoEm">SLA Realizado em</Label>
          <Input
            id="f-slaRealizadoEm"
            type="datetime-local"
            value={values.slaRealizadoEm ? values.slaRealizadoEm.slice(0, 16) : ""}
            onChange={(e) => set("slaRealizadoEm", e.target.value ? new Date(e.target.value).toISOString() : "")}
            disabled={readOnly}
            className={`${errors.slaRealizadoEm ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-slaStatus">Status do SLA</Label>
          <Select
            value={values.slaStatus != null ? String(values.slaStatus) : ""}
            onValueChange={(v) => set("slaStatus", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-slaStatus" className={`${errors.slaStatus ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_SLASTATUS.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaRiscoAtraso">IA — Risco de Atraso</Label>
          <Input
            id="f-iaRiscoAtraso"
            type="number"
            value={values.iaRiscoAtraso ?? ""}
            onChange={(e) => set("iaRiscoAtraso", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.iaRiscoAtraso ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaScoreComplexidade">IA — Score Complexidade</Label>
          <Input
            id="f-iaScoreComplexidade"
            type="number"
            value={values.iaScoreComplexidade ?? ""}
            onChange={(e) => set("iaScoreComplexidade", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.iaScoreComplexidade ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaScorePrioridade">IA — Score Prioridade</Label>
          <Input
            id="f-iaScorePrioridade"
            type="number"
            value={values.iaScorePrioridade ?? ""}
            onChange={(e) => set("iaScorePrioridade", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.iaScorePrioridade ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaRecomendacao">IA — Recomendação</Label>
          <Textarea
            id="f-iaRecomendacao"
            value={values.iaRecomendacao ?? ""}
            onChange={(e) => set("iaRecomendacao", e.target.value)}
            disabled={readOnly}
            className={`${errors.iaRecomendacao ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-ordemFila">Ordem na Fila</Label>
          <Input
            id="f-ordemFila"
            type="number"
            value={values.ordemFila ?? ""}
            onChange={(e) => set("ordemFila", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.ordemFila ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-protocoloOrigemId">Protocolo de Origem (ID)</Label>
          <Input
            id="f-protocoloOrigemId"
            type="number"
            value={values.protocoloOrigemId ?? ""}
            onChange={(e) => set("protocoloOrigemId", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.protocoloOrigemId ? " border-destructive" : ""}`}
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
