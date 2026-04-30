import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { workflowTipoDocSvc, tiposDocumentoSvc } from "@/services/fluxodocs";
import type {
  FluxodocsWorkflowTipoDocumento, FluxodocsTipoDocumento,
} from "@/types/entities/fluxodocs";

export default function WorkflowTipoDocPage() {
  const [tiposDoc, setTiposDoc] = useState<FluxodocsTipoDocumento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    tiposDocumentoSvc.list().then(setTiposDoc).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center p-8 text-muted-foreground">
      <Loader2 className="size-4 animate-spin mr-2" /> Carregando...
    </div>
  );

  const tipoOpts = tiposDoc.map((t) => ({ id: t.id, value: t.nome }));
  const lbl = (id: number) => tipoOpts.find((o) => o.id === id)?.value ?? `#${id}`;

  const fields: FieldDef<FluxodocsWorkflowTipoDocumento>[] = [
    { name: "nome", label: "Nome do Workflow", type: "text", required: true, inTable: true,
      tooltip: "Identifica o fluxo (ex: Workflow padrão de SADT)." },
    { name: "tipoDocumentoId", label: "Tipo de Documento", type: "select", required: true,
      options: tipoOpts, inTable: true, renderCell: (r) => lbl(r.tipoDocumentoId) },
    { name: "descricao", label: "Descrição", type: "textarea" },
  ];

  return (
    <SimpleCadastroPage
      title="Workflow por Tipo de Documento"
      description="Cada tipo de documento pode ter um workflow próprio. Use a tela 'Ordem dos Status' para definir as etapas."
      entityLabel="Workflow"
      service={workflowTipoDocSvc}
      fields={fields}
      searchFields={["nome"]}
    />
  );
}
