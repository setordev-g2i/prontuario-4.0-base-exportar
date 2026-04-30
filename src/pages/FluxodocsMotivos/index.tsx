import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsMotivo } from "@/types/entities/Fluxodocs";
import { motivosService } from "@/services/fluxodocs/motivos";

const TIPOS = ["ENVIO", "DEVOLUCAO", "CANCELAMENTO", "REENVIO", "JUSTIFICATIVA"];

const config: CrudConfig<FluxodocsMotivo> = {
  entity: "fluxodocs-motivos",
  titlePlural: "Motivos",
  titleSingular: "Motivo",
  searchKey: "nome",
  tooltip: "Motivos de envio, devolução, cancelamento, reenvio e justificativa.",
  service: motivosService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    {
      key: "tipo",
      label: "Tipo",
      type: "select",
      required: true,
      span: 1,
      optionsSource: async () => TIPOS.map((t, i) => ({ id: i + 1, value: t })),
      formatList: (v) => String(v ?? "—"),
    },
  ],
};

// Override: tipo do motivo é string (não FK), então usamos input text simples
const fixedConfig: CrudConfig<FluxodocsMotivo> = {
  ...config,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    {
      key: "tipo",
      label: "Tipo",
      type: "text",
      required: true,
      span: 1,
      placeholder: "ENVIO | DEVOLUCAO | CANCELAMENTO | REENVIO | JUSTIFICATIVA",
      tooltip: "ENVIO, DEVOLUCAO, CANCELAMENTO, REENVIO ou JUSTIFICATIVA.",
    },
  ],
};

export default function FluxodocsMotivosPage() {
  return <CrudPage config={fixedConfig} />;
}
