export interface ProfissionalProdutividade {
  id: number | string;
  profissionalId: number | string;
  convenioId: number;
  procedimentoId: number;
  situacaoId: number; // 1 ativo, 2 inativo

  // Aba Produtividade
  percRecebimento?: number | null;
  percProdCaixa?: number | null;
  percImposto?: number | null;
  vlFixo?: number | null;
  percImpostoCaixa?: number | null;
  percClinica?: number | null;
  fixoClinica?: number | null;
  laudoVlFixo?: number | null;
  terceiroProfissionalId?: number | string | null;
  terceiroPerc?: number | null;
  vigenciaInicial?: string | null;
  vigenciaFinal?: string | null;

  // Aba Configurações
  opcaoDtrecebimentoCalculaProdutividadeVlcaixa?: boolean;
  opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio?: boolean;
  opcaoDtatendimentoCalculaProdutividadeVlcaixa?: boolean;
  opcaoDtatendimentoCalculaProdutividadeVlfaturado?: boolean;
  operacaoCreditoOuDebito?: number; // 1 crédito, 2 débito

  userId?: number;
  created?: string;
  modified?: string;
}

export type CreateProfissionalProdutividadeDTO = Omit<
  ProfissionalProdutividade,
  "id" | "created" | "modified"
>;

export type UpdateProfissionalProdutividadeDTO =
  Partial<CreateProfissionalProdutividadeDTO>;
