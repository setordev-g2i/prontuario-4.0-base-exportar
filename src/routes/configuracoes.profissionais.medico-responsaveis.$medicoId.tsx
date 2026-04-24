import { createFileRoute } from "@tanstack/react-router";
import { MedicoResponsaveisPage } from "@/features/medico-responsaveis/page";

export const Route = createFileRoute("/configuracoes/profissionais/medico-responsaveis/$medicoId")({
  validateSearch: (search: Record<string, unknown>) => ({
    modo: search.modo === "visualizar" ? "visualizar" : undefined,
  }),
  component: MedicoResponsaveisDetailRoute,
});

function MedicoResponsaveisDetailRoute() {
  const { medicoId } = Route.useParams();
  const { modo } = Route.useSearch();

  return <MedicoResponsaveisPage mode={modo === "visualizar" ? "view" : "edit"} medicoId={Number(medicoId)} />;
}
