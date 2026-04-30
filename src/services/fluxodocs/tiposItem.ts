import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsTipoItem } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string]> = [
  ["Conta", "CONTA", "Vinculado a uma conta de faturamento"],
  ["Atendimento", "ATENDIMENTO", "Vinculado a um atendimento"],
  ["Paciente", "PACIENTE", "Vinculado a um paciente"],
  ["Documento", "DOCUMENTO", "Documento avulso"],
  ["Ofício", "OFICIO", "Ofício formal"],
  ["Manual", "MANUAL", "Inclusão manual sem vínculo"],
  ["Lote de Contas", "LOTE_CONTAS", "Lote de contas hospitalares"],
  ["Lote de Atendimentos", "LOTE_ATEND", "Lote de atendimentos"],
  ["Recurso de Glosa", "RECURSO_GLOSA", "Item de recurso"],
  ["Anexo Complementar", "ANEXO", "Anexo complementar"],
  ["Notificação", "NOTIFICACAO", "Notificação ao convênio"],
  ["Justificativa", "JUSTIFICATIVA", "Justificativa formal"],
  ["Procedimento Avulso", "PROC_AVULSO", "Procedimento isolado"],
  ["Internação", "INTERNACAO", "Vinculado a internação"],
  ["Cirurgia", "CIRURGIA", "Vinculado a cirurgia"],
  ["Exame", "EXAME", "Vinculado a exame"],
  ["Laudo", "LAUDO", "Vinculado a laudo"],
  ["Receita", "RECEITA", "Receita médica"],
  ["Termo", "TERMO", "Termo de consentimento"],
  ["Pedido", "PEDIDO", "Pedido médico"],
  ["Outros", "OUTROS", "Outras categorias"],
];

const seed = () =>
  ITEMS.map(([nome, codigo, descricao], i) => ({
    id: i + 1,
    nome,
    codigo,
    descricao,
    ordem: i + 1,
    ...baseAudit(),
  })) as FluxodocsTipoItem[];

export const tiposItemService = makeMockService<FluxodocsTipoItem>(seed);
