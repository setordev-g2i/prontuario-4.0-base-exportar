import { createFileRoute } from "@tanstack/react-router";
import { ProfissionaisPage } from "@/features/profissionais/ProfissionaisPage";

export const Route = createFileRoute("/configuracoes/profissionais")({
  component: ProfissionaisPage,
});
