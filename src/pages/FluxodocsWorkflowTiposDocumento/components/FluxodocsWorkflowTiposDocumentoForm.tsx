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
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";

const OPTS_TIPODOCUMENTOID = [{id:1,value:"Conta Médica"},{id:2,value:"Guia SP/SADT"},{id:3,value:"Guia Internação"},{id:4,value:"Guia Consulta"},{id:5,value:"Laudo Médico"},{id:6,value:"Receituário"},{id:7,value:"Solicitação de Exame"},{id:8,value:"Termo de Consentimento"},{id:9,value:"Relatório Cirúrgico"},{id:10,value:"Evolução Clínica"}];

export interface WorkflowTiposDocumentoFormValues {
  nome: string;
  tipoDocumentoId: number | null;
  descricao: string;
}

interface Props {
  mode: "create" | "edit";
  readOnly?: boolean;
  initial?: FluxodocsWorkflowTipoDocumento | null;
  onSubmit: (values: WorkflowTiposDocumentoFormValues) => void;
  onCancel: () => void;
  submitting?: boolean;
}

function buildInitialValues(entity: FluxodocsWorkflowTipoDocumento | null | undefined): WorkflowTiposDocumentoFormValues {
  if (!entity) {
    return {
    nome: "",
    tipoDocumentoId: null,
    descricao: "",
    };
  }
  return {
      nome: entity.nome ?? "",
      tipoDocumentoId: entity.tipoDocumentoId ?? null,
      descricao: entity.descricao ?? "",
  };
}

export function WorkflowTiposDocumentoForm({
  mode,
  readOnly,
  initial,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [values, setValues] = useState<WorkflowTiposDocumentoFormValues>(() => buildInitialValues(initial));
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setValues(buildInitialValues(initial));
    setErrors({});
  }, [initial, mode]);

  function set<K extends keyof WorkflowTiposDocumentoFormValues>(key: K, value: WorkflowTiposDocumentoFormValues[K]) {
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
