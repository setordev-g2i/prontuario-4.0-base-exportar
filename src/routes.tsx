import { Routes, Route } from "react-router-dom";
import { MainLayout, NotFound } from "@/components/MainLayout";
import DashboardPage from "@/pages/Dashboard";

// Profissionais
import ProfissionaisListPage from "@/pages/Profissionais";
import ProfissionaisNovoPage from "@/pages/Profissionais/novo";
import ProfissionaisEditarPage from "@/pages/Profissionais/editar";
import ProfissionaisVisualizarPage from "@/pages/Profissionais/visualizar";
import ProfissionaisCbosPage from "@/pages/ProfissionaisCbos";
import ProfissionaisEspecialidadesPage from "@/pages/ProfissionaisEspecialidades";

// Pacientes
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
          element={<ProfissionaisListPage />}
        />
        <Route
          path="/configuracoes/profissionais/novo"
          element={<ProfissionaisNovoPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id"
          element={<ProfissionaisVisualizarPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id/editar"
          element={<ProfissionaisEditarPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id/cbos"
          element={<ProfissionaisCbosPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id/especialidades"
          element={<ProfissionaisEspecialidadesPage />}
        />

        {/* Pacientes */}
        <Route path="/pacientes" element={<PacientesListPage />} />
        <Route path="/pacientes/novo" element={<PacientesNovoPage />} />
        <Route path="/pacientes/:id" element={<PacientesVisualizarPage />} />
        <Route
          path="/pacientes/:id/editar"
          element={<PacientesEditarPage />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
