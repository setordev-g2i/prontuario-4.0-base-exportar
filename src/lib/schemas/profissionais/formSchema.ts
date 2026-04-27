import { z } from "zod";
import { isValidCPF } from "@/lib/validators";

export const profissionalFormSchema = z.object({
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
  conselho: z.string().optional().or(z.literal("")),
  situacaoId: z.number(),
});

export type ProfissionalFormValues = z.infer<typeof profissionalFormSchema>;
