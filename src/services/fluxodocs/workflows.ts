import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsWorkflowTipoDocumento } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[number, string, string]> = [
  [1, "Workflow Guia SP/SADT", "Fluxo padrão para guias SP/SADT"],
  [2, "Workflow Guia Internação", "Fluxo padrão de guia de internação"],
  [3, "Workflow Guia Honorários", "Honorários médicos"],
  [4, "Workflow Conta Hospitalar", "Conta hospitalar completa"],
  [5, "Workflow Resumo de Alta", "Resumo de alta hospitalar"],
  [6, "Workflow Laudo Médico", "Laudos para auditoria"],
  [7, "Workflow Prescrição", "Prescrição médica"],
  [8, "Workflow Evolução", "Evolução clínica"],
  [9, "Workflow Termo Consentimento", "Termos diversos"],
  [10, "Workflow Doc Identidade", "Documento do paciente"],
  [11, "Workflow CPF Paciente", "CPF do paciente"],
  [12, "Workflow Carteirinha", "Carteirinha do convênio"],
  [13, "Workflow Pedido Médico", "Pedidos médicos"],
  [14, "Workflow Autorização", "Autorizações prévias"],
  [15, "Workflow Relatório Cirurgia", "Relatórios cirúrgicos"],
  [16, "Workflow Ofício", "Ofícios diversos"],
  [17, "Workflow Recurso de Glosa", "Recursos contra glosa"],
  [18, "Workflow Notificação", "Notificações"],
  [19, "Workflow Cópia Prontuário", "Cópias de prontuário"],
  [20, "Workflow Boletim", "Boletins de atendimento"],
  [21, "Workflow Anexo", "Anexos genéricos"],
];

const seed = () =>
  ITEMS.map(([tipoDocumentoId, nome, descricao], i) => ({
    id: i + 1,
    tipoDocumentoId,
    nome,
    descricao,
    ...baseAudit(),
  })) as FluxodocsWorkflowTipoDocumento[];

export const workflowsService = makeMockService<FluxodocsWorkflowTipoDocumento>(seed);
