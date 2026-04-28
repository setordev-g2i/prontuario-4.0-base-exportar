import { z } from "zod";

const numNullable = z
  .union([z.number(), z.null(), z.undefined()])
  .transform((v) => (v === undefined ? null : v));

export const procedimentoSchema = z.object({
  // Dados Principais
  nome: z.string().min(1, "Nome é obrigatório"),
  grupoId: z
    .number({ message: "Grupo é obrigatório" })
    .int()
    .min(1, "Grupo é obrigatório"),
  anotacaoFolha: z.string().nullable().optional(),
  diasEntrega: numNullable.optional(),
  procedimentoModuloUtilizacaoId: numNullable.optional(),
  apelido: z.string().nullable().optional(),
  codigoTabAmb: z.string().nullable().optional(),
  situacaoId: z.union([z.literal(1), z.literal(2)]),

  // Faturamento
  faturaTipoCobrancaFaturaValorId: z
    .number({ message: "Tipo de Cobrança é obrigatório" })
    .int()
    .min(1, "Tipo de Cobrança é obrigatório"),
  procedimentoSubGrupoId: z
    .number({ message: "Subgrupo é obrigatório" })
    .int()
    .min(1, "Subgrupo é obrigatório"),
  usaGuiaOutrasDespesas: z.boolean().optional(),
  usaGuiaResumoInternacao: z.boolean().optional(),
  usaGuiaSadt: z.boolean().optional(),
  usaGuiaHonorarioIndividual: z.boolean().optional(),
  usaGuiaConsulta: z.boolean().optional(),
  abaFaturamentoPadrao: numNullable.optional(),
  consideraComoMatMed: z.boolean().optional(),

  // SUS
  susCodigoProcedimento: z.string().min(1, "Código SUS é obrigatório"),
  susNomeProcedimento: z.string().min(1, "Nome SUS é obrigatório"),
  susSexo: z.enum(["0", "M", "F"]),
  susPermanenciaMedia: z.number().int(),
  susPermanenciaTempo: z.number().int(),
  susPermanenciaMaximo: z.number().int(),
  susPontos: z.number().int(),
  susIdadeMinimaMeses: z.number().int(),
  susIdadeMaximaMeses: z.number().int(),
  susGrupoId: numNullable.optional(),
  susSubgrupoId: numNullable.optional(),
  susFormaOrganizacao: z.string().min(1, "Forma Organização é obrigatória"),
  susModalidade: z.string().min(1, "Modalidade é obrigatória"),
  susSistemaFaturamento: z
    .number({ message: "Sistema de Faturamento é obrigatório" })
    .int(),
  procedimentoPrincipal: z.boolean().optional(),
  susPreencheAihParto: z.boolean().optional(),
  susPreencheAihLaqueaduraVasectomia: z.boolean().optional(),
  susPreencheAihOpme: z.boolean().optional(),
  susPreencheAihUtiNeoNatal: z.boolean().optional(),
  susPreencheAihRegistroCivil: z.boolean().optional(),
  cihaTipoProcedimento: z.string().nullable().optional(),
  susPreencheApacTipo: numNullable.optional(),

  // Laudo
  nomeLaudo: z.string().min(1, "Nome Laudo é obrigatório"),
  digitaLaudo: z.boolean().optional(),
  origemLaudo: numNullable.optional(),
  laudoMetaFormularioId: numNullable.optional(),
  responsavelAssinaturaLaudo: numNullable.optional(),

  // Produtividade
  produtividadeSolicitantePaga: z.boolean().optional(),
  regraPagamentoProdutividade: numNullable.optional(),
  regraPagamentoProfissionalEspecifico: numNullable.optional(),

  // Relatórios
  mostraTelaAtenderProcedimento: z.boolean().optional(),
  sadtMostraData: z.boolean().optional(),
  fichaAtendimentoImpressaUrlModelo: z.string().nullable().optional(),
  sumarioAltaHabilitado: z.boolean().optional(),
  habilitaRelAgendamento: z.boolean().optional(),

  // Home Care
  homeCareVlCusto: numNullable.optional(),
  hcaaCodigo: z.string().nullable().optional(),
  grupoAgendaSessoesId: numNullable.optional(),

  // Configurações
  prescricaoTipoId: numNullable.optional(),
  seraUtilizadoAso: z.boolean().optional(),
  prescricaoHabilitaDescricaoCentroCirurgico: z.boolean().optional(),
  prescricaoHabilitaDescricaoCirurgicaBeiraLeito: z.boolean().optional(),
  geraEquipeAutomaticamente: z.boolean().optional(),
  permiteLancarEquipe: z.boolean().optional(),
  comboProcedimentos: z.boolean().optional(),
  estqArtigoId: numNullable.optional(),
});

export type ProcedimentoFormValues = z.infer<typeof procedimentoSchema>;

export const PROCEDIMENTO_FIELD_LABELS: Record<string, string> = {
  nome: "Nome",
  grupoId: "Grupo",
  situacaoId: "Situação",
  faturaTipoCobrancaFaturaValorId: "Tipo de Cobrança",
  procedimentoSubGrupoId: "Subgrupo",
  susCodigoProcedimento: "Código SUS",
  susNomeProcedimento: "Nome SUS",
  susSexo: "Regra Sexo",
  susPermanenciaMedia: "Permanência Média",
  susPermanenciaTempo: "Tempo de Permanência",
  susPermanenciaMaximo: "Permanência Máxima",
  susPontos: "Pontos",
  susIdadeMinimaMeses: "Idade Mínima",
  susIdadeMaximaMeses: "Idade Máxima",
  susFormaOrganizacao: "Forma Organização",
  susModalidade: "Modalidade",
  susSistemaFaturamento: "Sistema de Faturamento",
  nomeLaudo: "Nome Laudo",
};
