import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { iaSvc } from "@/services/fluxodocs";
import type { FluxodocsParametroIa } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsParametroIa>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Nome amigável do parâmetro de IA." },
  { name: "chave", label: "Chave", type: "text", required: true, inTable: true,
    tooltip: "Identificador técnico (ex: peso_prioridade)." },
  { name: "valor", label: "Valor", type: "text", required: true, inTable: true,
    tooltip: "Valor numérico ou de texto utilizado pelo motor de IA." },
];

export default function ParametrosIAPage() {
  return (
    <SimpleCadastroPage
      title="Parâmetros de IA"
      description="Pesos e limites usados pelo motor de IA na priorização da fila e no cálculo de risco."
      entityLabel="Parâmetro de IA"
      service={iaSvc}
      fields={fields}
      searchFields={["nome", "chave"]}
    />
  );
}
