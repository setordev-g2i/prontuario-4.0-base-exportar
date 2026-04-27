export interface Paciente {
  id: number | string;
  nome: string;
  cpf: string;
  rg?: string;
  dataNascimento: string; // yyyy-MM-dd
  sexo?: "masculino" | "feminino" | "outro";
  email?: string;
  telefone?: string;
  celular?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estadoId?: number | string;
  situacaoId: number; // 1 = Ativo, 2 = Inativo
  createdAt?: string;
  updatedAt?: string;
}

export type CreatePacienteDTO = Omit<Paciente, "id" | "createdAt" | "updatedAt">;
export type UpdatePacienteDTO = Partial<CreatePacienteDTO>;
