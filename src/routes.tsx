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

// Procedimentos
import ProcedimentosPage from "@/pages/Procedimentos";

// Fluxo de Documentos
import FluxoDocumentosHub from "@/pages/FluxoDocumentos";
import FdSetores from "@/pages/FluxoDocumentos/Setores";
import FdTiposDocumento from "@/pages/FluxoDocumentos/TiposDocumento";
import FdMotivos from "@/pages/FluxoDocumentos/Motivos";
import FdTiposMovimentacao from "@/pages/FluxoDocumentos/TiposMovimentacao";
import FdPrioridades from "@/pages/FluxoDocumentos/Prioridades";
import FdStatus from "@/pages/FluxoDocumentos/Status";
import FdTiposItem from "@/pages/FluxoDocumentos/TiposItem";
import FdStatusItem from "@/pages/FluxoDocumentos/StatusItem";
import FdRegrasFluxo from "@/pages/FluxoDocumentos/RegrasFluxo";
import FdWorkflowTipoDoc from "@/pages/FluxoDocumentos/WorkflowTipoDoc";
import FdOrdemStatus from "@/pages/FluxoDocumentos/OrdemStatus";
import FdSla from "@/pages/FluxoDocumentos/ParametrosSla";
import FdIa from "@/pages/FluxoDocumentos/ParametrosIA";
import FdDocConvenio from "@/pages/FluxoDocumentos/DocumentacaoConvenio";

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
        <Route
          path="/configuracoes/procedimentos"
          element={<ProcedimentosPage />}
        />

        {/* Configurações → Fluxo de Documentos */}
        <Route path="/configuracoes/fluxo-documentos" element={<FluxoDocumentosHub />} />
        <Route path="/configuracoes/fluxo-documentos/setores" element={<FdSetores />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-documento" element={<FdTiposDocumento />} />
        <Route path="/configuracoes/fluxo-documentos/motivos" element={<FdMotivos />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-movimentacao" element={<FdTiposMovimentacao />} />
        <Route path="/configuracoes/fluxo-documentos/prioridades" element={<FdPrioridades />} />
        <Route path="/configuracoes/fluxo-documentos/status" element={<FdStatus />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-item" element={<FdTiposItem />} />
        <Route path="/configuracoes/fluxo-documentos/status-item" element={<FdStatusItem />} />
        <Route path="/configuracoes/fluxo-documentos/regras-fluxo" element={<FdRegrasFluxo />} />
        <Route path="/configuracoes/fluxo-documentos/workflow-tipo-doc" element={<FdWorkflowTipoDoc />} />
        <Route path="/configuracoes/fluxo-documentos/ordem-status" element={<FdOrdemStatus />} />
        <Route path="/configuracoes/fluxo-documentos/sla" element={<FdSla />} />
        <Route path="/configuracoes/fluxo-documentos/ia" element={<FdIa />} />
        <Route path="/configuracoes/fluxo-documentos/documentacao-convenio" element={<FdDocConvenio />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
