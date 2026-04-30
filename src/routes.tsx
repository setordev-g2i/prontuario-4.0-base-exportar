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
import FluxoDocumentosIndexPage from "@/pages/FluxoDocumentos";
import FluxodocsSetoresPage from "@/pages/FluxodocsSetores";
import FluxodocsTiposDocumentoPage from "@/pages/FluxodocsTiposDocumento";
import FluxodocsMotivosPage from "@/pages/FluxodocsMotivos";
import FluxodocsTiposMovimentacaoPage from "@/pages/FluxodocsTiposMovimentacao";
import FluxodocsPrioridadesPage from "@/pages/FluxodocsPrioridades";
import FluxodocsStatusPage from "@/pages/FluxodocsStatus";
import FluxodocsTiposItemPage from "@/pages/FluxodocsTiposItem";
import FluxodocsStatusItemPage from "@/pages/FluxodocsStatusItem";
import FluxodocsRegrasFluxoPage from "@/pages/FluxodocsRegrasFluxo";
import FluxodocsParametrosSlaPage from "@/pages/FluxodocsParametrosSla";
import FluxodocsParametrosIaPage from "@/pages/FluxodocsParametrosIa";
import FluxodocsWorkflowTiposDocumentoPage from "@/pages/FluxodocsWorkflowTiposDocumento";
import FluxodocsWorkflowEtapasPage from "@/pages/FluxodocsWorkflowEtapas";
import FluxodocsDocumentosObrigatoriosConvenioPage from "@/pages/FluxodocsDocumentosObrigatoriosConvenio";
import FluxodocsChecklistDocumentalPage from "@/pages/FluxodocsChecklistDocumental";
import FluxodocsAprovacoesJustificativaPage from "@/pages/FluxodocsAprovacoesJustificativa";
import FluxodocsProtocolosPage from "@/pages/FluxodocsProtocolos";
import FluxodocsProtocoloItensPage from "@/pages/FluxodocsProtocoloItens";
import FluxodocsLogsPage from "@/pages/FluxodocsLogs";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />

        {/* Profissionais */}
        <Route path="/configuracoes/profissionais" element={<ProfissionaisListPage />} />
        <Route path="/configuracoes/profissionais/:id/cbos" element={<ProfissionaisCbosPage />} />
        <Route path="/configuracoes/profissionais/:id/especialidades" element={<ProfissionaisEspecialidadesPage />} />

        {/* Pacientes */}
        <Route path="/pacientes" element={<PacientesListPage />} />

        {/* Procedimentos */}
        <Route path="/configuracoes/procedimentos/grupos" element={<GruposProcedimentosPage />} />
        <Route path="/configuracoes/procedimentos" element={<ProcedimentosPage />} />

        {/* Fluxo de Documentos — índice */}
        <Route path="/configuracoes/fluxo-documentos" element={<FluxoDocumentosIndexPage />} />
        {/* Cadastros */}
        <Route path="/configuracoes/fluxo-documentos/setores" element={<FluxodocsSetoresPage />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-documento" element={<FluxodocsTiposDocumentoPage />} />
        <Route path="/configuracoes/fluxo-documentos/motivos" element={<FluxodocsMotivosPage />} />
        {/* Cadastros Operacionais */}
        <Route path="/configuracoes/fluxo-documentos/tipos-movimentacao" element={<FluxodocsTiposMovimentacaoPage />} />
        <Route path="/configuracoes/fluxo-documentos/prioridades" element={<FluxodocsPrioridadesPage />} />
        <Route path="/configuracoes/fluxo-documentos/status" element={<FluxodocsStatusPage />} />
        <Route path="/configuracoes/fluxo-documentos/tipos-item" element={<FluxodocsTiposItemPage />} />
        <Route path="/configuracoes/fluxo-documentos/status-item" element={<FluxodocsStatusItemPage />} />
        {/* Workflow */}
        <Route path="/configuracoes/fluxo-documentos/workflows" element={<FluxodocsWorkflowTiposDocumentoPage />} />
        <Route path="/configuracoes/fluxo-documentos/workflow-etapas" element={<FluxodocsWorkflowEtapasPage />} />
        <Route path="/configuracoes/fluxo-documentos/regras-fluxo" element={<FluxodocsRegrasFluxoPage />} />
        {/* Parâmetros */}
        <Route path="/configuracoes/fluxo-documentos/parametros-sla" element={<FluxodocsParametrosSlaPage />} />
        <Route path="/configuracoes/fluxo-documentos/parametros-ia" element={<FluxodocsParametrosIaPage />} />
        {/* Documentação */}
        <Route path="/configuracoes/fluxo-documentos/documentos-obrigatorios" element={<FluxodocsDocumentosObrigatoriosConvenioPage />} />
        <Route path="/configuracoes/fluxo-documentos/checklist" element={<FluxodocsChecklistDocumentalPage />} />
        <Route path="/configuracoes/fluxo-documentos/aprovacoes-justificativa" element={<FluxodocsAprovacoesJustificativaPage />} />
        {/* Operacional */}
        <Route path="/configuracoes/fluxo-documentos/protocolos" element={<FluxodocsProtocolosPage />} />
        <Route path="/configuracoes/fluxo-documentos/protocolo-itens" element={<FluxodocsProtocoloItensPage />} />
        {/* Auditoria */}
        <Route path="/configuracoes/fluxo-documentos/logs" element={<FluxodocsLogsPage />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
