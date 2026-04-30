import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { workflowEtapaSvc, workflowTipoDocSvc, statusSvc } from "@/services/fluxodocs";
import type {
  FluxodocsWorkflowEtapa, FluxodocsWorkflowTipoDocumento, FluxodocsStatus,
} from "@/types/entities/fluxodocs";

export default function OrdemStatusPage() {
  const [workflows, setWorkflows] = useState<FluxodocsWorkflowTipoDocumento[]>([]);
  const [status, setStatus] = useState<FluxodocsStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([workflowTipoDocSvc.list(), statusSvc.list()])
      .then(([w, s]) => { setWorkflows(w); setStatus(s); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="size-4 animate-spin mr-2" /> Carregando...
    </div>
  );

  const wfOpts = workflows.map((w) => ({ id: w.id, value: w.nome }));
  const stOpts = status.map((s) => ({ id: s.id, value: s.nome }));
  const lbl = (opts: {id: number; value: string}[], id: number) =>
    opts.find((o) => o.id === id)?.value ?? `#${id}`;

  const fields: FieldDef<FluxodocsWorkflowEtapa>[] = [
    { name: "workflowId", label: "Workflow", type: "select", required: true, options: wfOpts,
      inTable: true, renderCell: (r) => lbl(wfOpts, r.workflowId) },
    { name: "statusOrigemId", label: "Status Origem", type: "select", required: true, options: stOpts,
      inTable: true, renderCell: (r) => lbl(stOpts, r.statusOrigemId) },
    { name: "statusDestinoId", label: "Status Destino", type: "select", required: true, options: stOpts,
      inTable: true, renderCell: (r) => lbl(stOpts, r.statusDestinoId) },
    { name: "acao", label: "Ação", type: "text", required: true, inTable: true,
      tooltip: "Nome da ação que dispara a transição (ex: ENVIAR, RECEBER)." },
    { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1, inTable: true },
    { name: "exigeMotivo", label: "Exige motivo", type: "switch", defaultValue: false },
    { name: "exigeObservacao", label: "Exige observação", type: "switch", defaultValue: false },
    { name: "permiteReversao", label: "Permite reversão", type: "switch", defaultValue: false },
    { name: "perfilPermitido", label: "Perfil permitido", type: "text",
      tooltip: "Perfil do usuário autorizado a executar a ação." },
  ];

  return (
    <SimpleCadastroPage
      title="Ordem dos Status / Etapas do Workflow"
      description="Transições permitidas entre status dentro de cada workflow."
      entityLabel="Etapa de Workflow"
      service={workflowEtapaSvc}
      fields={fields}
    />
  );
}
