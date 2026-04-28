export interface GrupoProcedimento {
  id: number;
  codigoGrupo: string;
  nome: string;
  situacaoId: 1 | 2;
  color: string;
  procedimentoSubGrupoId: number;

  // Faturamento
  percentualLucro?: number | null;
  percentualDesconto?: number | null;
  tipoDataFaturamento?: 1 | 2 | 3 | null;
  faturaTabelaConvenioCapituloId?: number | null;
  contabilidadeCodreduzido?: string | null;

  // Relatórios
  utilizaInternacaoMapaImpressaoColunaAcomodacao?: boolean;
  utilizaInternacaoMapaImpressaoColunaProcedimentos?: boolean;
  relProducaoTotalizaMedico?: boolean;
  relProducaoTotalizaMatmed?: boolean;
  relProducaoRelExecutante?: boolean;
  relProducaoRelSolicitante?: boolean;

  // Home Care
  homecareNomeGrupoRelatorio?: string | null;
  homecareOrdemOrcamento?: number | null;
  homecareListaEquipamentoRequisitar?: boolean;

  // Configurações
  modalidadedicom?: string | null;
  userId: string;
  created: string;
  modified: string;
}

export type CreateGrupoProcedimentoDTO = Omit<
  GrupoProcedimento,
  "id" | "created" | "modified" | "userId"
>;

export type UpdateGrupoProcedimentoDTO = Partial<CreateGrupoProcedimentoDTO>;

export const SUBGRUPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Padrão" },
  { id: 2, value: "Consultas" },
  { id: 3, value: "Exames" },
  { id: 4, value: "Cirúrgico" },
  { id: 5, value: "Terapias" },
];

export const TIPO_DATA_FATURAMENTO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Data do Atendimento" },
  { id: 2, value: "Data da Execução" },
  { id: 3, value: "Data da Execução da Sessão" },
];

export const CAPITULO_CONVENIO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Consultas" },
  { id: 2, value: "Exames" },
  { id: 3, value: "Terapias" },
  { id: 4, value: "Cirurgias" },
  { id: 5, value: "Materiais e Medicamentos" },
];
