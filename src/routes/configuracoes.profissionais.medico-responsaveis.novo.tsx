import { createFileRoute } from "@tanstack/react-router";
import { MedicoResponsaveisPage } from "@/features/medico-responsaveis/page";

export const Route = createFileRoute("/configuracoes/profissionais/medico-responsaveis/novo")({
  component: MedicoResponsaveisNewRoute,
});

function MedicoResponsaveisNewRoute() {
  return <MedicoResponsaveisPage mode="new" />;
}
