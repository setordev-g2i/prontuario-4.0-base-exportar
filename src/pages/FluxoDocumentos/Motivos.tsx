import { SimpleCadastroPage, type FieldDef } from "./_shared/SimpleCadastroPage";
import { motivosSvc } from "@/services/fluxodocs";
import { TIPOS_MOTIVO } from "@/types/entities/fluxodocs";
import type { FluxodocsMotivo } from "@/types/entities/fluxodocs";

const fields: FieldDef<FluxodocsMotivo>[] = [
  { name: "nome", label: "Nome", type: "text", required: true, inTable: true,
    tooltip: "Motivo registrado em ações de envio, devolução, cancelamento etc." },
  { name: "tipo", label: "Tipo", type: "select", required: true, inTable: true,
    options: TIPOS_MOTIVO.map((t) => ({ id: t, value: t })) },
];

export default function MotivosPage() {
  return (
    <SimpleCadastroPage
      title="Motivos"
      description="Motivos utilizados em movimentações de fluxo"
      entityLabel="Motivo"
      service={motivosSvc}
      fields={fields}
      searchFields={["nome", "tipo"]}
    />
  );
}
