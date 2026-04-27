export interface ProfissionalCbo {
  id: number | string;
  profissionalId: number | string;
  cboId: string;
  situacaoId: number;
  createdAt?: string;
  updatedAt?: string;
}

export type CreateProfissionalCboDTO = Omit<
  ProfissionalCbo,
  "id" | "createdAt" | "updatedAt"
>;
export type UpdateProfissionalCboDTO = Partial<CreateProfissionalCboDTO>;
