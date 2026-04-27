export interface ProfissionalEspecialidade {
  id: number | string;
  profissionalId: number | string;
  especialidadeId: string;
  situacaoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProfissionalEspecialidadeDTO = Omit<
  ProfissionalEspecialidade,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProfissionalEspecialidadeDTO =
  Partial<CreateProfissionalEspecialidadeDTO>;
