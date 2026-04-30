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
import type { FluxodocsProtocoloItem } from "@/types/entities/Fluxodocs";

const OPTS_PROTOCOLOID = Array.from({length:8},(_,i)=>({id:i+1,value:`Protocolo ${i+1}`})) as const;
const OPTS_TIPOITEMID = [{id:1,value:"CONTA"},{id:2,value:"ATENDIMENTO"},{id:3,value:"PACIENTE"},{id:4,value:"DOCUMENTO"},{id:5,value:"OFICIO"},{id:6,value:"MANUAL"}] as const;
const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}] as const;
const OPTS_CONTAID = Array.from({length:10},(_,i)=>({id:i+1,value:`Conta ${20260000+i}`})) as const;
const OPTS_ATENDIMENTOID = Array.from({length:10},(_,i)=>({id:i+1,value:`Atendimento ${10000+i}`})) as const;
const OPTS_CLIENTEID = Array.from({length:15},(_,i)=>({id:i+1,value:`Paciente ${String(i+1).padStart(3,"0")}`})) as const;
const OPTS_CONVENIOID = [{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}] as const;
const OPTS_STATUSITEMID = [{id:1,value:"Pendente"},{id:2,value:"Aceito"},{id:3,value:"Devolvido"}] as const;
const OPTS_MOTIVODEVOLUCAOID = [{id:1,value:"Envio para auditoria"},{id:2,value:"Documento ilegível"},{id:3,value:"Falta de assinatura"},{id:4,value:"Falta carteirinha"},{id:5,value:"CID inconsistente"},{id:6,value:"Procedimento divergente"}] as const;

export interface ProtocoloItenFormValues {
  protocoloId: number | null;
  tipoItemId: number | null;
  tipoDocumentoId: number | null;
  contaId: number | null;
  atendimentoId: number | null;
  clienteId: number | null;
  convenioId: number | null;
  descricaoManual: string;
  statusItemId: number | null;
  motivoDevolucaoId: number | null;
  observacao: string;
  iaProbabilidadeGlosa: number | null;
  iaSugestaoDevolucao: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsProtocoloItem | null;
  onSubmit: (values: ProtocoloItenFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsProtocoloItem | null | undefined): ProtocoloItenFormValues {
  if (!entity) {
    return {
    protocoloId: null,
    tipoItemId: null,
    tipoDocumentoId: null,
    contaId: null,
    atendimentoId: null,
    clienteId: null,
    convenioId: null,
    descricaoManual: "",
    statusItemId: null,
    motivoDevolucaoId: null,
    observacao: "",
    iaProbabilidadeGlosa: null,
    iaSugestaoDevolucao: "",
    };
  }
  return {
      protocoloId: entity.protocoloId ?? null,
      tipoItemId: entity.tipoItemId ?? null,
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      contaId: entity.contaId ?? null,
      atendimentoId: entity.atendimentoId ?? null,
      clienteId: entity.clienteId ?? null,
      convenioId: entity.convenioId ?? null,
      descricaoManual: entity.descricaoManual ?? "",
      statusItemId: entity.statusItemId ?? null,
      motivoDevolucaoId: entity.motivoDevolucaoId ?? null,
      observacao: entity.observacao ?? "",
      iaProbabilidadeGlosa: entity.iaProbabilidadeGlosa ?? null,
      iaSugestaoDevolucao: entity.iaSugestaoDevolucao ?? "",
  };
}

export function ProtocoloItenForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<ProtocoloItenFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ProtocoloItenFormValues>(key: K, value: ProtocoloItenFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.protocoloId && values.protocoloId !== 0) {
      newErrors.protocoloId = true;
      firstError ??= "Protocolo";
    }
    if (!values.tipoItemId && values.tipoItemId !== 0) {
      newErrors.tipoItemId = true;
      firstError ??= "Tipo de Item";
    }
    if (!values.statusItemId && values.statusItemId !== 0) {
      newErrors.statusItemId = true;
      firstError ??= "Status do Item";
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
          <Label htmlFor="f-tipoItemId">Tipo de Item *</Label>
          <Select
            value={values.tipoItemId != null ? String(values.tipoItemId) : ""}
            onValueChange={(v) => set("tipoItemId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-tipoItemId" className={`${errors.tipoItemId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_TIPOITEMID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-tipoDocumentoId">Tipo de Documento</Label>
          <Select
            value={values.tipoDocumentoId != null ? String(values.tipoDocumentoId) : ""}
            onValueChange={(v) => set("tipoDocumentoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-tipoDocumentoId" className={`${errors.tipoDocumentoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_TIPODOCUMENTOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-contaId">Conta</Label>
          <Select
            value={values.contaId != null ? String(values.contaId) : ""}
            onValueChange={(v) => set("contaId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-contaId" className={`${errors.contaId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_CONTAID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-atendimentoId">Atendimento</Label>
          <Select
            value={values.atendimentoId != null ? String(values.atendimentoId) : ""}
            onValueChange={(v) => set("atendimentoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-atendimentoId" className={`${errors.atendimentoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_ATENDIMENTOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-clienteId">Paciente</Label>
          <Select
            value={values.clienteId != null ? String(values.clienteId) : ""}
            onValueChange={(v) => set("clienteId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-clienteId" className={`${errors.clienteId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_CLIENTEID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-convenioId">Convênio</Label>
          <Select
            value={values.convenioId != null ? String(values.convenioId) : ""}
            onValueChange={(v) => set("convenioId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-convenioId" className={`${errors.convenioId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_CONVENIOID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-descricaoManual">Descrição Manual</Label>
          <Textarea
            id="f-descricaoManual"
            value={values.descricaoManual ?? ""}
            onChange={(e) => set("descricaoManual", e.target.value)}
            disabled={readOnly}
            className={`${errors.descricaoManual ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusItemId">Status do Item *</Label>
          <Select
            value={values.statusItemId != null ? String(values.statusItemId) : ""}
            onValueChange={(v) => set("statusItemId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusItemId" className={`${errors.statusItemId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSITEMID.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-motivoDevolucaoId">Motivo de Devolução</Label>
          <Select
            value={values.motivoDevolucaoId != null ? String(values.motivoDevolucaoId) : ""}
            onValueChange={(v) => set("motivoDevolucaoId", v ? Number(v) : null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-motivoDevolucaoId" className={`${errors.motivoDevolucaoId ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_MOTIVODEVOLUCAOID.map((o) => (
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
          <Label htmlFor="f-iaProbabilidadeGlosa">IA — Probabilidade de Glosa</Label>
          <Input
            id="f-iaProbabilidadeGlosa"
            type="number"
            value={values.iaProbabilidadeGlosa ?? ""}
            onChange={(e) => set("iaProbabilidadeGlosa", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.iaProbabilidadeGlosa ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaSugestaoDevolucao">IA — Sugestão de Devolução</Label>
          <Textarea
            id="f-iaSugestaoDevolucao"
            value={values.iaSugestaoDevolucao ?? ""}
            onChange={(e) => set("iaSugestaoDevolucao", e.target.value)}
            disabled={readOnly}
            className={`${errors.iaSugestaoDevolucao ? " border-destructive" : ""}`}
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
