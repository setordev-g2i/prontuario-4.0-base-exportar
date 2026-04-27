import { Routes, Route } from "react-router-dom";
import { MainLayout, NotFound } from "@/components/MainLayout";
import DashboardPage from "@/pages/Dashboard";
import ProfissionaisIndex from "@/pages/Profissionais";
import PacientesListPage from "@/pages/Pacientes";
import PacientesNovoPage from "@/pages/Pacientes/novo";
import PacientesEditarPage from "@/pages/Pacientes/editar";
import PacientesVisualizarPage from "@/pages/Pacientes/visualizar";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        {/* Profissionais */}
        <Route
          path="/configuracoes/profissionais"
          element={<ProfissionaisIndex />}
        />

        {/* Pacientes */}
        <Route path="/pacientes" element={<PacientesListPage />} />
        <Route path="/pacientes/novo" element={<PacientesNovoPage />} />
        <Route path="/pacientes/:id" element={<PacientesVisualizarPage />} />
        <Route path="/pacientes/:id/editar" element={<PacientesEditarPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
