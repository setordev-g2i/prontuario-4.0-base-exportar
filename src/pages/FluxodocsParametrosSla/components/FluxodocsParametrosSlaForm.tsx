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
import type { FluxodocsParametroSla } from "@/types/entities/Fluxodocs";

const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}] as const;
const OPTS_SETORDESTINOID = [{id:1,value:"Recepção"},{id:2,value:"Faturamento"},{id:3,value:"Auditoria"},{id:4,value:"Glosas"},{id:5,value:"TISS"},{id:6,value:"Convênios"}] as const;
const OPTS_PRIORIDADEID = [{id:1,value:"Normal"},{id:2,value:"Alta"},{id:3,value:"Urgente"}] as const;
const OPTS_CONVENIOID = [{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}] as const;

export interface ParametrosSlaFormValues {
  tipoDocumentoId: number | null;
  setorDestinoId: number | null;
  prioridadeId: number | null;
  convenioId: number | null;
  prazoHoras: number | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsParametroSla | null;
  onSubmit: (values: ParametrosSlaFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsParametroSla | null | undefined): ParametrosSlaFormValues {
  if (!entity) {
    return {
    tipoDocumentoId: null,
    setorDestinoId: null,
    prioridadeId: null,
    convenioId: null,
    prazoHoras: 24,
    };
  }
  return {
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      setorDestinoId: entity.setorDestinoId ?? null,
      prioridadeId: entity.prioridadeId ?? null,
      convenioId: entity.convenioId ?? null,
      prazoHoras: entity.prazoHoras ?? null,
  };
}

export function ParametrosSlaForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<ParametrosSlaFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ParametrosSlaFormValues>(key: K, value: ParametrosSlaFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.tipoDocumentoId && values.tipoDocumentoId !== 0) {
      newErrors.tipoDocumentoId = true;
      firstError ??= "Tipo de Documento";
    }
    if (!values.prioridadeId && values.prioridadeId !== 0) {
      newErrors.prioridadeId = true;
      firstError ??= "Prioridade";
    }
    if (values.prazoHoras === null || values.prazoHoras === undefined) {
      newErrors.prazoHoras = true;
      firstError ??= "Prazo (horas)";
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
          <Label htmlFor="f-setorDestinoId">Setor de Destino</Label>
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
          <Label htmlFor="f-prazoHoras">Prazo (horas) *</Label>
          <Input
            id="f-prazoHoras"
            type="number"
            value={values.prazoHoras ?? ""}
            onChange={(e) => set("prazoHoras", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.prazoHoras ? " border-destructive" : ""}`}
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
