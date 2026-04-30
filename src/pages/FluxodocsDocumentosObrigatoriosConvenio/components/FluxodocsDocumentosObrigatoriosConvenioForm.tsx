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
import type { FluxodocsDocumentoObrigatorioConvenio } from "@/types/entities/Fluxodocs";

const OPTS_CONVENIOID = [{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}];
const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}];
const OPTS_TIPOMOVIMENTACAOID = [{id:1,value:"ENVIO"},{id:2,value:"REMESSA"},{id:3,value:"DEVOLUCAO"},{id:4,value:"REENVIO"},{id:5,value:"INTERNO"},{id:6,value:"RECEBIMENTO_MANUAL"}];
const OPTS_PRIORIDADEID = [{id:1,value:"Normal"},{id:2,value:"Alta"},{id:3,value:"Urgente"}];

export interface DocumentosObrigatoriosConvenioFormValues {
  convenioId: number | null;
  tipoDocumentoId: number | null;
  tipoMovimentacaoId: number | null;
  prioridadeId: number | null;
  obrigatorio: boolean;
  bloqueiaEnvio: boolean;
  exigeJustificativaAusencia: boolean;
  exigeAprovacaoJustificativa: boolean;
  descricao: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsDocumentoObrigatorioConvenio | null;
  onSubmit: (values: DocumentosObrigatoriosConvenioFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsDocumentoObrigatorioConvenio | null | undefined): DocumentosObrigatoriosConvenioFormValues {
  if (!entity) {
    return {
    convenioId: null,
    tipoDocumentoId: null,
    tipoMovimentacaoId: null,
    prioridadeId: null,
    obrigatorio: true,
    bloqueiaEnvio: false,
    exigeJustificativaAusencia: false,
    exigeAprovacaoJustificativa: false,
    descricao: "",
    };
  }
  return {
      convenioId: entity.convenioId ?? null,
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      tipoMovimentacaoId: entity.tipoMovimentacaoId ?? null,
      prioridadeId: entity.prioridadeId ?? null,
      obrigatorio: !!entity.obrigatorio,
      bloqueiaEnvio: !!entity.bloqueiaEnvio,
      exigeJustificativaAusencia: !!entity.exigeJustificativaAusencia,
      exigeAprovacaoJustificativa: !!entity.exigeAprovacaoJustificativa,
      descricao: entity.descricao ?? "",
  };
}

export function DocumentosObrigatoriosConvenioForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<DocumentosObrigatoriosConvenioFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof DocumentosObrigatoriosConvenioFormValues>(key: K, value: DocumentosObrigatoriosConvenioFormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((er) => (er[key as string] ? { ...er, [key as string]: false } : er));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    let firstError: string | undefined;
    if (!values.convenioId && values.convenioId !== 0) {
      newErrors.convenioId = true;
      firstError ??= "Convênio";
    }
    if (!values.tipoDocumentoId && values.tipoDocumentoId !== 0) {
      newErrors.tipoDocumentoId = true;
      firstError ??= "Tipo de Documento";
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
          <Label htmlFor="f-convenioId">Convênio *</Label>
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
          <Label htmlFor="f-tipoMovimentacaoId">Tipo de Movimentação</Label>
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
          <Label htmlFor="f-prioridadeId">Prioridade</Label>
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
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-obrigatorio" className="text-sm">Obrigatório</Label>
          <Switch
            id="f-obrigatorio"
            checked={!!values.obrigatorio}
            onCheckedChange={(v) => set("obrigatorio", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-bloqueiaEnvio" className="text-sm">Bloqueia envio</Label>
          <Switch
            id="f-bloqueiaEnvio"
            checked={!!values.bloqueiaEnvio}
            onCheckedChange={(v) => set("bloqueiaEnvio", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-exigeJustificativaAusencia" className="text-sm">Exige justificativa de ausência</Label>
          <Switch
            id="f-exigeJustificativaAusencia"
            checked={!!values.exigeJustificativaAusencia}
            onCheckedChange={(v) => set("exigeJustificativaAusencia", v)}
            disabled={readOnly}
          />
        </div>
        <div className="flex items-center justify-between rounded border px-3 py-2">
          <Label htmlFor="f-exigeAprovacaoJustificativa" className="text-sm">Exige aprovação da justificativa</Label>
          <Switch
            id="f-exigeAprovacaoJustificativa"
            checked={!!values.exigeAprovacaoJustificativa}
            onCheckedChange={(v) => set("exigeAprovacaoJustificativa", v)}
            disabled={readOnly}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-descricao">Descrição</Label>
          <Textarea
            id="f-descricao"
            value={values.descricao ?? ""}
            onChange={(e) => set("descricao", e.target.value)}
            disabled={readOnly}
            className={`${errors.descricao ? " border-destructive" : ""}`}
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
