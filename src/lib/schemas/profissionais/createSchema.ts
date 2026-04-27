import { z } from "zod";
import { isValidCPF } from "@/lib/validators";

export const createProfissionalSchema = z.object({
  nome: z.string().min(1, "O campo Nome é obrigatório"),
  tipoCadastroId: z.string().min(1, "O campo Tipo de Cadastro é obrigatório"),
  cpf: z
    .string()
    .min(1, "O campo CPF é obrigatório")
    .refine((v) => v.replace(/\D/g, "").length === 11, "CPF deve ter 11 dígitos")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  situacaoId: z
    .union([z.string(), z.number()])
    .refine((v) => String(v).length > 0, "O campo Situação é obrigatório"),
});

export type CreateProfissionalDTO = z.infer<typeof createProfissionalSchema>;
