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
import type { FluxodocsRegraFluxo } from "@/types/entities/Fluxodocs";

const OPTS_SETORORIGEMID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}];
const OPTS_SETORDESTINOID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}];
const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}];
const OPTS_TIPOMOVIMENTACAOID = [{id:1,value:"ENVIO"},{id:2,value:"REMESSA"},{id:3,value:"DEVOLUCAO"},{id:4,value:"REENVIO"},{id:5,value:"INTERNO"},{id:6,value:"RECEBIMENTO_MANUAL"}];

export interface RegrasFluxoFormValues {
  setorOrigemId: number | null;
  setorDestinoId: number | null;
  tipoDocumentoId: number | null;
  tipoMovimentacaoId: number | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsRegraFluxo | null;
  onSubmit: (values: RegrasFluxoFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsRegraFluxo | null | undefined): RegrasFluxoFormValues {
  if (!entity) {
    return {
    setorOrigemId: null,
    setorDestinoId: null,
    tipoDocumentoId: null,
    tipoMovimentacaoId: null,
    };
  }
  return {
      setorOrigemId: entity.setorOrigemId ?? null,
      setorDestinoId: entity.setorDestinoId ?? null,
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      tipoMovimentacaoId: entity.tipoMovimentacaoId ?? null,
  };
}

export function RegrasFluxoForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<RegrasFluxoFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof RegrasFluxoFormValues>(key: K, value: RegrasFluxoFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.setorOrigemId) {
      newErrors.setorOrigemId = true;
      firstError ??= "Setor de Origem";
    }
    if (!values.setorDestinoId) {
      newErrors.setorDestinoId = true;
      firstError ??= "Setor de Destino";
    }
    if (!values.tipoDocumentoId) {
      newErrors.tipoDocumentoId = true;
      firstError ??= "Tipo de Documento";
    }
    if (!values.tipoMovimentacaoId) {
      newErrors.tipoMovimentacaoId = true;
      firstError ??= "Tipo de Movimentação";
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
          <Label htmlFor="f-tipoDocumentoId">Tipo de Documento *</Label>
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
