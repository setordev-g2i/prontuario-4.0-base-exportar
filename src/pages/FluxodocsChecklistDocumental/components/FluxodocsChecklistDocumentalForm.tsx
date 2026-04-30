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
import type { FluxodocsChecklistDocumental } from "@/types/entities/Fluxodocs";

const OPTS_PROTOCOLOID = Array.from({length:8},(_,i)=>({id:i+1,value:`Protocolo ${i+1}`}));
const OPTS_ITEMID = Array.from({length:8},(_,i)=>({id:i+1,value:`Item ${i+1}`}));
const OPTS_CONVENIOID = [{id:1,value:"Particular"},{id:2,value:"Unimed"},{id:3,value:"Bradesco Saúde"},{id:4,value:"Amil"},{id:5,value:"SUS"}];
const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}];
const OPTS_STATUSCHECKLIST = [{id:"PENDENTE",value:"Pendente"},{id:"ANEXADO",value:"Anexado"},{id:"CONFIRMADO",value:"Confirmado"},{id:"JUSTIFICADO",value:"Justificado"},{id:"BLOQUEANTE",value:"Bloqueante"}];

export interface ChecklistDocumentalFormValues {
  protocoloId: number | null;
  itemId: number | null;
  convenioId: number | null;
  tipoDocumentoId: number | null;
  documentoObrigatorioId: number | null;
  statusChecklist: string | null;
  documentoAnexadoId: number | null;
  justificativaAusencia: string;
  iaSugestao: string;
  iaRiscoGlosa: number | null;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsChecklistDocumental | null;
  onSubmit: (values: ChecklistDocumentalFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsChecklistDocumental | null | undefined): ChecklistDocumentalFormValues {
  if (!entity) {
    return {
    protocoloId: null,
    itemId: null,
    convenioId: null,
    tipoDocumentoId: null,
    documentoObrigatorioId: null,
    statusChecklist: "PENDENTE",
    documentoAnexadoId: null,
    justificativaAusencia: "",
    iaSugestao: "",
    iaRiscoGlosa: null,
    };
  }
  return {
      protocoloId: entity.protocoloId ?? null,
      itemId: entity.itemId ?? null,
      convenioId: entity.convenioId ?? null,
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      documentoObrigatorioId: entity.documentoObrigatorioId ?? null,
      statusChecklist: entity.statusChecklist ?? null,
      documentoAnexadoId: entity.documentoAnexadoId ?? null,
      justificativaAusencia: entity.justificativaAusencia ?? "",
      iaSugestao: entity.iaSugestao ?? "",
      iaRiscoGlosa: entity.iaRiscoGlosa ?? null,
  };
}

export function ChecklistDocumentalForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<ChecklistDocumentalFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof ChecklistDocumentalFormValues>(key: K, value: ChecklistDocumentalFormValues[K]) {
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
    if (!values.tipoDocumentoId && values.tipoDocumentoId !== 0) {
      newErrors.tipoDocumentoId = true;
      firstError ??= "Tipo de Documento";
    }
    if (!values.statusChecklist && values.statusChecklist !== 0) {
      newErrors.statusChecklist = true;
      firstError ??= "Status do Checklist";
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
          <Label htmlFor="f-documentoObrigatorioId">Documento Obrigatório</Label>
          <Input
            id="f-documentoObrigatorioId"
            type="number"
            value={values.documentoObrigatorioId ?? ""}
            onChange={(e) => set("documentoObrigatorioId", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.documentoObrigatorioId ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-statusChecklist">Status do Checklist *</Label>
          <Select
            value={values.statusChecklist != null ? String(values.statusChecklist) : ""}
            onValueChange={(v) => set("statusChecklist", v || null)}
            disabled={readOnly}
          >
            <SelectTrigger id="f-statusChecklist" className={`${errors.statusChecklist ? " border-destructive" : ""}`}>
              <SelectValue placeholder="Selecione..." />
            </SelectTrigger>
            <SelectContent>
              {OPTS_STATUSCHECKLIST.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-documentoAnexadoId">Documento Anexado (ID)</Label>
          <Input
            id="f-documentoAnexadoId"
            type="number"
            value={values.documentoAnexadoId ?? ""}
            onChange={(e) => set("documentoAnexadoId", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.documentoAnexadoId ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-justificativaAusencia">Justificativa de Ausência</Label>
          <Textarea
            id="f-justificativaAusencia"
            value={values.justificativaAusencia ?? ""}
            onChange={(e) => set("justificativaAusencia", e.target.value)}
            disabled={readOnly}
            className={`${errors.justificativaAusencia ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaSugestao">IA — Sugestão</Label>
          <Textarea
            id="f-iaSugestao"
            value={values.iaSugestao ?? ""}
            onChange={(e) => set("iaSugestao", e.target.value)}
            disabled={readOnly}
            className={`${errors.iaSugestao ? " border-destructive" : ""}`}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="f-iaRiscoGlosa">IA — Risco de Glosa</Label>
          <Input
            id="f-iaRiscoGlosa"
            type="number"
            value={values.iaRiscoGlosa ?? ""}
            onChange={(e) => set("iaRiscoGlosa", e.target.value === "" ? null : Number(e.target.value))}
            disabled={readOnly}
            className={`${errors.iaRiscoGlosa ? " border-destructive" : ""}`}
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
