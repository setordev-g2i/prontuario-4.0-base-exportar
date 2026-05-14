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
import FluxoDocumentosHubPage from "@/pages/FluxoDocumentos";
import FluxodocsSetoresPage from "@/pages/FluxodocsSetores";
import FluxodocsTiposDocumentoPage from "@/pages/FluxodocsTiposDocumento";
import FluxodocsMotivosPage from "@/pages/FluxodocsMotivos";
import FluxodocsTiposMovimentacaoPage from "@/pages/FluxodocsTiposMovimentacao";
import FluxodocsPrioridadesPage from "@/pages/FluxodocsPrioridades";
import FluxodocsStatusPage from "@/pages/FluxodocsStatus";
import FluxodocsTiposItemPage from "@/pages/FluxodocsTiposItem";
import FluxodocsStatusItemPage from "@/pages/FluxodocsStatusItem";
import FluxodocsWorkflowTiposDocumentoPage from "@/pages/FluxodocsWorkflowTiposDocumento";
import FluxodocsWorkflowEtapasPage from "@/pages/FluxodocsWorkflowEtapas";
import FluxodocsRegrasFluxoPage from "@/pages/FluxodocsRegrasFluxo";
import FluxodocsParametrosSlaPage from "@/pages/FluxodocsParametrosSla";
import FluxodocsParametrosIaPage from "@/pages/FluxodocsParametrosIa";
import FluxodocsDocumentosObrigatoriosConvenioPage from "@/pages/FluxodocsDocumentosObrigatoriosConvenio";
import FluxodocsChecklistDocumentalPage from "@/pages/FluxodocsChecklistDocumental";
import FluxodocsAprovacoesJustificativaPage from "@/pages/FluxodocsAprovacoesJustificativa";
import FluxodocsProtocolosPage from "@/pages/FluxodocsProtocolos";
import FluxodocsProtocoloItensPage from "@/pages/FluxodocsProtocoloItens";
import FluxodocsLogsPage from "@/pages/FluxodocsLogs";
import FluxodocsOperacionalPage from "@/pages/FluxoDocumentosOperacional";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        {/* Profissionais — todas as ações em modal na listagem */}
        <Route path="/configuracoes/profissionais" element={<ProfissionaisListPage />} />
        <Route path="/configuracoes/profissionais/:id/cbos" element={<ProfissionaisCbosPage />} />
        <Route path="/configuracoes/profissionais/:id/especialidades" element={<ProfissionaisEspecialidadesPage />} />

        {/* Pacientes */}
        <Route path="/pacientes" element={<PacientesListPage />} />

        {/* Configurações → Procedimentos */}
        <Route path="/configuracoes/procedimentos/grupos" element={<GruposProcedimentosPage />} />
        <Route path="/configuracoes/procedimentos" element={<ProcedimentosPage />} />

        {/* Configurações → Fluxo de Documentos */}
        <Route path="/configuracoes/fluxo-documentos" element={<FluxoDocumentosHubPage />} />
        <Route path="/configuracoes/fluxo-documentos/setores" element={<FluxodocsSetoresPage />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-documento" element={<FluxodocsTiposDocumentoPage />} />
        <Route path="/configuracoes/fluxo-documentos/motivos" element={<FluxodocsMotivosPage />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-movimentacao" element={<FluxodocsTiposMovimentacaoPage />} />
        <Route path="/configuracoes/fluxo-documentos/prioridades" element={<FluxodocsPrioridadesPage />} />
        <Route path="/configuracoes/fluxo-documentos/status" element={<FluxodocsStatusPage />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-item" element={<FluxodocsTiposItemPage />} />
        <Route path="/configuracoes/fluxo-documentos/status-item" element={<FluxodocsStatusItemPage />} />
        <Route path="/configuracoes/fluxo-documentos/workflows" element={<FluxodocsWorkflowTiposDocumentoPage />} />
        <Route path="/configuracoes/fluxo-documentos/workflow-etapas" element={<FluxodocsWorkflowEtapasPage />} />
        <Route path="/configuracoes/fluxo-documentos/regras-fluxo" element={<FluxodocsRegrasFluxoPage />} />
        <Route path="/configuracoes/fluxo-documentos/parametros-sla" element={<FluxodocsParametrosSlaPage />} />
        <Route path="/configuracoes/fluxo-documentos/parametros-ia" element={<FluxodocsParametrosIaPage />} />
        <Route path="/configuracoes/fluxo-documentos/documentos-obrigatorios-convenio" element={<FluxodocsDocumentosObrigatoriosConvenioPage />} />
        <Route path="/configuracoes/fluxo-documentos/checklist" element={<FluxodocsChecklistDocumentalPage />} />
        <Route path="/configuracoes/fluxo-documentos/aprovacoes-justificativa" element={<FluxodocsAprovacoesJustificativaPage />} />
        <Route path="/configuracoes/fluxo-documentos/protocolos" element={<FluxodocsProtocolosPage />} />
        <Route path="/configuracoes/fluxo-documentos/protocolo-itens" element={<FluxodocsProtocoloItensPage />} />
        <Route path="/configuracoes/fluxo-documentos/logs" element={<FluxodocsLogsPage />} />

        {/* Gerenciamento → Fluxo de Documentos (operacional) */}
        <Route path="/gerenciamento/fluxo-documentos" element={<FluxodocsOperacionalPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
