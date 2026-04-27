import { z } from "zod";
import { isValidCPF } from "@/lib/validators";

export const profissionalFormSchema = z.object({
  // Dados Principais
  nome: z.string().trim().min(3, "Informe o nome completo"),
  tipoCadastroId: z.string().min(1, "O campo Tipo de Cadastro é obrigatório"),
  cpf: z
    .string()
    .trim()
    .min(1, "CPF é obrigatório")
    .refine((v) => v.replace(/\D/g, "").length === 11, "CPF deve ter 11 dígitos")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  rg: z.string().optional().or(z.literal("")),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  sexo: z.enum(["masculino", "feminino", "outro"]).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  situacaoId: z.number(),

  // Complementares I — Endereço
  cep: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  numero: z.string().optional().or(z.literal("")),
  complemento: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  estadoId: z.string().optional().or(z.literal("")),

  // Complementares II
  estadoCivilId: z.string().optional().or(z.literal("")),
  religiao: z.string().optional().or(z.literal("")),
  etniaId: z.string().optional().or(z.literal("")),
  escolaridadeId: z.string().optional().or(z.literal("")),
  regiaoHomeCare: z.string().optional().or(z.literal("")),

  // Documentos e Registros
  sigla: z.string().optional().or(z.literal("")),
  conselho: z.string().optional().or(z.literal("")),
  statusConselhoId: z.string().optional().or(z.literal("")),
  rqe: z.string().optional().or(z.literal("")),
  nomeLaudo: z.string().optional().or(z.literal("")),
  conselhoLaudo: z.string().optional().or(z.literal("")),
  cns: z.string().optional().or(z.literal("")),
  pis: z.string().optional().or(z.literal("")),
  cbo: z.string().optional().or(z.literal("")),
  cnes: z.string().optional().or(z.literal("")),
  tipoPessoa: z.string().optional().or(z.literal("")),

  // Financeiro
  banco: z.string().optional().or(z.literal("")),
  agencia: z.string().optional().or(z.literal("")),
  conta: z.string().optional().or(z.literal("")),
  configApuracaoId: z.string().optional().or(z.literal("")),
  contabilidade: z.string().optional().or(z.literal("")),
  fornecedor: z.string().optional().or(z.literal("")),
  planosConta: z.string().optional().or(z.literal("")),
  tabelaRepasse: z.string().optional().or(z.literal("")),

  // Configurações
  atendePsiquiatricos: z.boolean().optional().default(false),
  cadastrarAgenda: z.boolean().optional().default(false),
  unidadeId: z.string().optional().or(z.literal("")),
  solicitanteSusId: z.string().optional().or(z.literal("")),

  // SUS
  vinculoSus: z.string().optional().or(z.literal("")),
});

export type ProfissionalFormValues = z.infer<typeof profissionalFormSchema>;

export const PROFISSIONAL_FIELD_LABELS: Record<string, string> = {
  nome: "Nome",
  tipoCadastroId: "Tipo de Cadastro",
  cpf: "CPF",
  rg: "RG",
  dataNascimento: "Dt. Nascimento",
  sexo: "Sexo",
  email: "Email",
  celular: "Celular",
  telefone: "Telefone",
  situacaoId: "Situação",
  cep: "CEP",
  endereco: "Endereço",
  numero: "Número",
  complemento: "Complemento",
  cidade: "Cidade",
  estadoId: "Estado",
  estadoCivilId: "Estado Civil",
  religiao: "Religião",
  etniaId: "Etnia",
  escolaridadeId: "Escolaridade",
  regiaoHomeCare: "Região Home Care",
  sigla: "Sigla",
  conselho: "Conselho (CRM)",
  statusConselhoId: "Status Conselho",
  rqe: "RQE",
  nomeLaudo: "Nome Laudo",
  conselhoLaudo: "Conselho Laudo",
  cns: "Cartão Nacional de Saúde",
  pis: "PIS",
  cbo: "CBO",
  cnes: "CNES",
  tipoPessoa: "Tipo de Pessoa",
  banco: "Banco",
  agencia: "Agência",
  conta: "Conta",
  configApuracaoId: "Configuração Apuração",
  contabilidade: "Contabilidade",
  fornecedor: "Fornecedor",
  planosConta: "Planos de Conta",
  tabelaRepasse: "Tabela Repasse",
  atendePsiquiatricos: "Atende Pacientes Psiquiátricos",
  cadastrarAgenda: "Cadastrar Agenda",
  unidadeId: "Unidade",
  solicitanteSusId: "Solicitante SUS",
  vinculoSus: "Vínculo SUS",
};
