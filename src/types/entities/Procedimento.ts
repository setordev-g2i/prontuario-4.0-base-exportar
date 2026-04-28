export interface Procedimento {
  id: number;

  // Dados Principais
  nome: string;
  grupoId: number;
  anotacaoFolha?: string | null;
  diasEntrega?: number | null;
  procedimentoModuloUtilizacaoId?: number | null;
  apelido?: string | null;
  codigoTabAmb?: string | null;
  situacaoId: 1 | 2;

  // Faturamento
  faturaTipoCobrancaFaturaValorId: number;
  procedimentoSubGrupoId: number;
  usaGuiaOutrasDespesas?: boolean;
  usaGuiaResumoInternacao?: boolean;
  usaGuiaSadt?: boolean;
  usaGuiaHonorarioIndividual?: boolean;
  usaGuiaConsulta?: boolean;
  abaFaturamentoPadrao?: number | null;
  consideraComoMatMed?: boolean;

  // SUS
  susCodigoProcedimento: string;
  susNomeProcedimento: string;
  susSexo: "0" | "M" | "F";
  susPermanenciaMedia: number;
  susPermanenciaTempo: number;
  susPermanenciaMaximo: number;
  susPontos: number;
  susIdadeMinimaMeses: number;
  susIdadeMaximaMeses: number;
  susGrupoId?: number | null;
  susSubgrupoId?: number | null;
  susFormaOrganizacao: string;
  susModalidade: string;
  susSistemaFaturamento: number;
  procedimentoPrincipal?: boolean;
  susPreencheAihParto?: boolean;
  susPreencheAihLaqueaduraVasectomia?: boolean;
  susPreencheAihOpme?: boolean;
  susPreencheAihUtiNeoNatal?: boolean;
  susPreencheAihRegistroCivil?: boolean;
  cihaTipoProcedimento?: string | null;
  susPreencheApacTipo?: number | null;

  // Laudo
  nomeLaudo: string;
  digitaLaudo?: boolean;
  origemLaudo?: number | null;
  laudoMetaFormularioId?: number | null;
  responsavelAssinaturaLaudo?: number | null;

  // Produtividade
  produtividadeSolicitantePaga?: boolean;
  regraPagamentoProdutividade?: number | null;
  regraPagamentoProfissionalEspecifico?: number | null;

  // Relatórios
  mostraTelaAtenderProcedimento?: boolean;
  sadtMostraData?: boolean;
  fichaAtendimentoImpressaUrlModelo?: string | null;
  sumarioAltaHabilitado?: boolean;
  habilitaRelAgendamento?: boolean;

  // Home Care
  homeCareVlCusto?: number | null;
  hcaaCodigo?: string | null;
  grupoAgendaSessoesId?: number | null;

  // Configurações
  prescricaoTipoId?: number | null;
  seraUtilizadoAso?: boolean;
  prescricaoHabilitaDescricaoCentroCirurgico?: boolean;
  prescricaoHabilitaDescricaoCirurgicaBeiraLeito?: boolean;
  geraEquipeAutomaticamente?: boolean;
  permiteLancarEquipe?: boolean;
  comboProcedimentos?: boolean;
  estqArtigoId?: number | null;

  // Auditoria
  userId: number;
  userModified: number;
  created: string;
  modified: string;
}

export type CreateProcedimentoDTO = Omit<
  Procedimento,
  "id" | "created" | "modified" | "userId" | "userModified"
>;

export type UpdateProcedimentoDTO = Partial<CreateProcedimentoDTO>;

/* ────────── Options para Selects ────────── */

export const GRUPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Consultas Médicas" },
  { id: 2, value: "Exames Laboratoriais" },
  { id: 3, value: "Exames de Imagem" },
  { id: 4, value: "Cirurgias Gerais" },
  { id: 5, value: "Fisioterapia" },
  { id: 6, value: "Terapias" },
];

export const PROC_MODULO_UTILIZACAO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Apenas procedimento" },
  { id: 2, value: "Procedimento com sessões" },
  { id: 3, value: "Procedimento com equipe" },
];

export const TIPO_COBRANCA_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Consulta" },
  { id: 2, value: "Exame" },
  { id: 3, value: "Pacote" },
  { id: 4, value: "Procedimentos/Exames" },
];

export const SUBGRUPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Padrão" },
  { id: 2, value: "Consultas" },
  { id: 3, value: "Exames" },
  { id: 4, value: "Cirúrgico" },
  { id: 5, value: "Terapias" },
];

export const ABA_FATURAMENTO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Procedimentos" },
  { id: 2, value: "Materiais" },
  { id: 3, value: "Medicamentos" },
  { id: 4, value: "Taxas" },
];

export const SUS_SEXO_OPTIONS: { value: string; label: string }[] = [
  { value: "0", label: "0 - Não se aplica" },
  { value: "M", label: "M - Masculino" },
  { value: "F", label: "F - Feminino" },
];

export const SUS_GRUPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Ações de Promoção e Prevenção em Saúde" },
  { id: 2, value: "Procedimentos com Finalidade Diagnóstica" },
  { id: 3, value: "Procedimentos Clínicos" },
  { id: 4, value: "Procedimentos Cirúrgicos" },
];

export const SUS_SUBGRUPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Ações Coletivas/Individuais" },
  { id: 2, value: "Diagnóstico em Laboratório Clínico" },
  { id: 3, value: "Consultas/Atendimentos/Acompanhamentos" },
  { id: 4, value: "Pequenas Cirurgias" },
];

export const SUS_SISTEMA_FATURAMENTO_OPTIONS: {
  id: number;
  value: string;
}[] = [
  { id: 1, value: "BPA - Boletim de Produção Ambulatorial" },
  { id: 2, value: "AIH - Autorização de Internação" },
  { id: 3, value: "APAC - Autorização de Procedimentos" },
];

export const CIHA_TIPO_OPTIONS: { value: string; label: string }[] = [
  { value: "0", label: "0 - Não Mostra" },
  { value: "CIHA-I", label: "CIHA-I - CIHA Individualizado" },
  { value: "CIHA-C", label: "CIHA-C - CIHA Consolidado" },
];

export const SUS_APAC_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Procedimento não utiliza APAC/S/Menu" },
  { id: 2, value: "APAC Principal" },
  { id: 3, value: "APAC Secundário" },
];

export const ORIGEM_LAUDO_OPTIONS: { id: number; value: string }[] = [
  { id: 0, value: "Prontuário" },
  { id: 1, value: "Integrado AP para laudo.pdf" },
  { id: 2, value: "Integrado AP para id.pdf" },
  { id: 3, value: "Integrado Postgres" },
  { id: 4, value: "GED" },
];

export const LAUDO_FORMULARIO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Formulário Padrão" },
  { id: 2, value: "Formulário Radiologia" },
  { id: 3, value: "Formulário Laboratório" },
];

export const RESPONSAVEL_LAUDO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Profissional responsável pelo atendimento" },
  { id: 2, value: "Médico cadastrado no usuário que assinou" },
];

export const REGRA_PAGAMENTO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Específico" },
  { id: 2, value: "Rateio" },
  { id: 3, value: "Executor Padrão" },
];

export const PROFISSIONAL_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Dr. João Silva" },
  { id: 2, value: "Dra. Maria Souza" },
  { id: 3, value: "Dr. Pedro Lima" },
];

export const GRUPO_AGENDA_SESSOES_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Fisioterapia" },
  { id: 2, value: "Psicologia" },
  { id: 3, value: "Fonoaudiologia" },
];

export const PRESCRICAO_TIPO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Padrão" },
  { id: 2, value: "Centro Cirúrgico" },
  { id: 3, value: "Beira Leito" },
];

export const ESTQ_ARTIGO_OPTIONS: { id: number; value: string }[] = [
  { id: 1, value: "Material Médico" },
  { id: 2, value: "Medicamento" },
  { id: 3, value: "Insumo Hospitalar" },
];
