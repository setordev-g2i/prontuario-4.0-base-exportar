import { Routes, Route } from "react-router-dom";
import { MainLayout, NotFound } from "@/components/MainLayout";
import DashboardPage from "@/pages/Dashboard";

// Profissionais
import ProfissionaisListPage from "@/pages/Profissionais";
import ProfissionaisCbosPage from "@/pages/ProfissionaisCbos";
import ProfissionaisEspecialidadesPage from "@/pages/ProfissionaisEspecialidades";

// Pacientes
import PacientesListPage from "@/pages/Pacientes";

// Grupos de Procedimentos
import GruposProcedimentosPage from "@/pages/GruposProcedimentos";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        {/* Profissionais — todas as ações (novo/editar/visualizar) acontecem em modal na listagem */}
        <Route
          path="/configuracoes/profissionais"
          element={<ProfissionaisListPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id/cbos"
          element={<ProfissionaisCbosPage />}
        />
        <Route
          path="/configuracoes/profissionais/:id/especialidades"
          element={<ProfissionaisEspecialidadesPage />}
        />

        {/* Pacientes — todas as ações em modal */}
        <Route path="/pacientes" element={<PacientesListPage />} />

        {/* Configurações → Procedimentos → Grupo de Procedimentos */}
        <Route
          path="/configuracoes/procedimentos/grupos"
          element={<GruposProcedimentosPage />}
        />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
