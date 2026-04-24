import { createFileRoute } from "@tanstack/react-router";
import { MedicoResponsaveisPage } from "@/features/medico-responsaveis/page";

export const Route = createFileRoute("/configuracoes/profissionais/medico-responsaveis/")({
  component: MedicoResponsaveisListRoute,
});

function MedicoResponsaveisListRoute() {
  return <MedicoResponsaveisPage mode="list" />;
}
