export interface Profissional {
  id: number | string;
  nome: string;
  tipoCadastroId: string;
  cpf: string;
  rg?: string;
  dataNascimento: string;
  sexo?: string;
  situacaoId: number;
  fotoPerfil?: string | null;
  conselho?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProfissionalDTO = Omit<
  Profissional,
  "id" | "createdAt" | "updatedAt"
>;

export type UpdateProfissionalDTO = Partial<CreateProfissionalDTO>;
