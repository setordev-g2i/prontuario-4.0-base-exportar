export type LookupOption = {
  id: number;
  value: string;
};

export type LookupCollections = {
  situacao_cadastros: LookupOption[];
  users: LookupOption[];
  fin_contabilidades: LookupOption[];
  tipo_conselho_profissional: LookupOption[];
  solicitantes: LookupOption[];
  solicitante_cbo: LookupOption[];
  configuracao_solicitantes_estados: LookupOption[];
  medico_responsaveis_tipo_cadastro: LookupOption[];
  homecare_escala_repasse_tabela_padrao: LookupOption[];
  estado_civis: LookupOption[];
  religiao: LookupOption[];
  etnia: LookupOption[];
  escolaridade: LookupOption[];
  home_care_regiao_responsavel: LookupOption[];
  configuracao_apuracao: LookupOption[];
  fin_fornecedores: LookupOption[];
  fin_plano_contas: LookupOption[];
  unidades: LookupOption[];
};

export type MedicoResponsavelListItem = {
  id: number;
  nome: string;
  cpf: string;
  crm: string;
  situacao: string | null;
  tipoConselho: string | null;
  unidade: string | null;
};

export type MedicoResponsavelRecord = {
  id?: number;
  nome: string;
  cpf: string;
  crm: string;
  situacao_id: number | null;
  user_id: number | null;
  produtividade_fin_contabilidade_id: number | null;
  id_tipo_conselho_profissional: number | null;
  solicitante_id: number | null;
  cbo_id: number | null;
  estado_id: number | null;
  tipo_cadastro_id: number | null;
  homecare_escala_repasse_tabela_padrao_id: number | null;
  estado_civil_id: number | null;
  religiao_id: number | null;
  etnia_id: number | null;
  escolaridade_id: number | null;
  home_care_regiao_responsavel_id: number | null;
  configuracao_apuracao_id: number | null;
  fin_fornecedor_id: number | null;
  contas_pagar_plano_contas_id: number | null;
  contas_receber_plano_contas_id: number | null;
  unidade_id: number | null;
  cbo_ids: number[];
  exportacoes_sus: string[];
  created_at?: string;
  updated_at?: string;
};

export type QuickCreateLookupTable = keyof LookupCollections;
