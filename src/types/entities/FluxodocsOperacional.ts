/**
 * Tipos operacionais do módulo Fluxo de Documentos (Etapa 2).
 * Reaproveita FluxodocsProtocolo/Item da Etapa 1 e adiciona estruturas
 * para wizard, fila inteligente, recebimento e relatórios.
 */
import type { FluxodocsProtocolo, FluxodocsProtocoloItem } from "./Fluxodocs";

export type ItemTipo = "CONTA" | "ATENDIMENTO" | "PACIENTE" | "DOCUMENTO" | "OFICIO" | "MANUAL";

export type SlaStatus = "NO_PRAZO" | "EM_RISCO" | "ATRASADO" | "ALERTA";

export type RiscoNivel = "BAIXO" | "MEDIO" | "ALTO" | "BLOQUEIO";

export interface ClienteMock {
  id: number;
  nome: string;
  cpf: string;
  dataNascimento: string;
}

export interface ConvenioMock {
  id: number;
  nome: string;
  registroAns: string;
  historicoGlosa: number; // 0..1
  historicoAtraso: number; // 0..1
}

export interface AtendimentoMock {
  id: number;
  numero: string;
  clienteId: number;
  convenioId: number | null;
  data: string;
  tipo: string;
}

export interface ContaMock {
  id: number;
  numero: string;
  clienteId: number;
  atendimentoId: number;
  convenioId: number;
  valor: number;
  emissao: string;
}

export interface FluxoItemDraft {
  uid: string;
  tipoItem: ItemTipo;
  tipoDocumentoId: number | null;
  contaId: number | null;
  atendimentoId: number | null;
  clienteId: number | null;
  convenioId: number | null;
  descricaoManual: string | null;
  observacao: string | null;
}

export interface ChecklistDraft {
  uid: string;
  itemUid: string | null;
  tipoDocumentoId: number;
  documentoObrigatorioId: number | null;
  obrigatorio: boolean;
  bloqueiaEnvio: boolean;
  exigeAprovacao: boolean;
  status: "PENDENTE" | "ANEXADO" | "CONFIRMADO" | "JUSTIFICADO" | "BLOQUEANTE";
  justificativa: string | null;
  documentoNome: string | null;
  aprovacaoStatus: "NAO_APLICA" | "PENDENTE" | "APROVADO" | "REPROVADO" | "CORRECAO";
}

export interface NovoFluxoDraft {
  // cabeçalho
  tipoMovimentacaoId: number | null;
  setorOrigemId: number | null;
  setorDestinoId: number | null;
  prioridadeId: number | null;
  motivoId: number | null;
  observacao: string;
  // itens + checklist
  itens: FluxoItemDraft[];
  checklist: ChecklistDraft[];
}

export interface FluxoCompleto {
  protocolo: FluxodocsProtocolo;
  itens: FluxodocsProtocoloItem[];
  // computed
  pacienteNome: string | null;
  convenioNome: string | null;
  contaNumero: string | null;
  setorOrigemNome: string;
  setorDestinoNome: string;
  prioridadeNome: string;
  prioridadeCor: string;
  statusNome: string;
  statusCor: string;
  scoreFila: number;
  riscoNivel: RiscoNivel;
  recomendacaoIa: string;
}

export interface SlaCalculo {
  slaPrevistoEm: string;
  prazoHoras: number;
  slaStatus: SlaStatus;
  iaRiscoAtraso: number;
  origem: string;
}
