import { CrudPage } from "@/pages/Fluxodocs/_engine/CrudPage";
import type { CrudConfig } from "@/pages/Fluxodocs/_engine/types";
import type { FluxodocsStatus } from "@/types/entities/Fluxodocs";
import { statusService } from "@/services/fluxodocs/status";

const config: CrudConfig<FluxodocsStatus> = {
  entity: "fluxodocs-status",
  titlePlural: "Status do Fluxo",
  titleSingular: "Status",
  searchKey: "nome",
  tooltip: "Controla a timeline e o workflow. Não permite alteração manual nas telas operacionais.",
  service: statusService,
  fields: [
    { key: "nome", label: "Nome", type: "text", required: true, span: 2 },
    { key: "codigo", label: "Código", type: "text", required: true, span: 1 },
    { key: "tipo", label: "Tipo", type: "text", span: 1, placeholder: "INICIAL | INTERMEDIARIO | FINAL" },
    { key: "ordem", label: "Ordem", type: "number", span: 1, tooltip: "Define a ordem na timeline e no workflow." },
    { key: "cor", label: "Cor", type: "color", span: 1 },
    { key: "permiteEdicao", label: "Permite edição", type: "boolean", span: 1 },
    { key: "finalizador", label: "Finaliza fluxo", type: "boolean", span: 1, tooltip: "Quando ativo, encerra o fluxo." },
  ],
};

export default function FluxodocsStatusPage() {
  return <CrudPage config={config} />;
}
