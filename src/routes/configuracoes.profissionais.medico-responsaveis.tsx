import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/configuracoes/profissionais/medico-responsaveis")({
  component: MedicoResponsaveisLayoutRoute,
});

function MedicoResponsaveisLayoutRoute() {
  return <Outlet />;
}
