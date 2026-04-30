import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { prioridadesSvc } from "@/services/fluxodocs";
import type { FluxodocsPrioridade } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsPrioridade>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Impacta diretamente a fila inteligente e SLA." },
  { name: "codigo", label: "Código", type: "text", required: true, inTable: true },
  { name: "peso", label: "Peso", type: "number", required: true, inTable: true, defaultValue: 1,
    tooltip: "Maior peso significa maior prioridade na fila." },
  { name: "cor", label: "Cor", type: "color", required: true, defaultValue: "#3b82f6", inTable: true,
    renderCell: (r) => (
      <span className="inline-flex items-center gap-2">
        <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: r.cor }} />
        {r.cor}
      </span>
    ) },
  { name: "ordem", label: "Ordem", type: "number", required: true, defaultValue: 1 },
];

export default function PrioridadesPage() {
  return (
    <SimpleCadastroPage
      title="Prioridades"
      description="Níveis de prioridade utilizados pela fila inteligente"
      entityLabel="Prioridade"
      service={prioridadesSvc}
      fields={fields}
      searchFields={["nome", "codigo"]}
    />
  );
}
