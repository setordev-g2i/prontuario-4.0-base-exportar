import { z } from "zod";
import { isValidCPF } from "@/lib/validators";

export const pacienteSchema = z.object({
  nome: z.string().trim().min(3, "Informe o nome completo"),
  cpf: z
    .string()
    .trim()
    .min(1, "CPF é obrigatório")
    .refine((v) => isValidCPF(v), "CPF inválido"),
  rg: z.string().trim().optional().or(z.literal("")),
  dataNascimento: z
    .string()
    .min(1, "Data de nascimento é obrigatória")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  sexo: z.enum(["masculino", "feminino", "outro"]).optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  celular: z.string().optional().or(z.literal("")),
  cep: z.string().optional().or(z.literal("")),
  endereco: z.string().optional().or(z.literal("")),
  numero: z.string().optional().or(z.literal("")),
  complemento: z.string().optional().or(z.literal("")),
  bairro: z.string().optional().or(z.literal("")),
  cidade: z.string().optional().or(z.literal("")),
  estadoId: z.union([z.string(), z.number()]).optional(),
  situacaoId: z.number(),
});

export type PacienteFormValues = z.infer<typeof pacienteSchema>;
