import { z } from "zod";

export const grupoProcedimentoSchema = z.object({
  codigoGrupo: z.string().min(1, "Código é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  situacaoId: z.union([z.literal(1), z.literal(2)]),
  color: z.string().min(1, "Cor é obrigatória"),
  procedimentoSubGrupoId: z
    .number({ message: "Subgrupo é obrigatório" })
    .int()
    .min(1, "Subgrupo é obrigatório"),

  percentualLucro: z.number().nullable().optional(),
  percentualDesconto: z.number().nullable().optional(),
  tipoDataFaturamento: z
    .union([z.literal(1), z.literal(2), z.literal(3)])
    .nullable()
    .optional(),
  faturaTabelaConvenioCapituloId: z.number().nullable().optional(),
  contabilidadeCodreduzido: z.string().nullable().optional(),

  utilizaInternacaoMapaImpressaoColunaAcomodacao: z.boolean().optional(),
  utilizaInternacaoMapaImpressaoColunaProcedimentos: z.boolean().optional(),
  relProducaoTotalizaMedico: z.boolean().optional(),
  relProducaoTotalizaMatmed: z.boolean().optional(),
  relProducaoRelExecutante: z.boolean().optional(),
  relProducaoRelSolicitante: z.boolean().optional(),

  homecareNomeGrupoRelatorio: z.string().nullable().optional(),
  homecareOrdemOrcamento: z.number().int().nullable().optional(),
  homecareListaEquipamentoRequisitar: z.boolean().optional(),

  modalidadedicom: z.string().nullable().optional(),
});

export type GrupoProcedimentoFormValues = z.infer<typeof grupoProcedimentoSchema>;

export const GRUPO_PROCEDIMENTO_FIELD_LABELS: Record<string, string> = {
  codigoGrupo: "Código",
  nome: "Nome",
  situacaoId: "Situação",
  color: "Cor",
  procedimentoSubGrupoId: "Subgrupo de Procedimento",
};
