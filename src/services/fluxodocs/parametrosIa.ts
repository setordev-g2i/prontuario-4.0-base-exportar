import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsParametroIa } from "@/types/entities/Fluxodocs";

const ITEMS: Array<[string, string, string]> = [
  ["Peso da Prioridade", "peso_prioridade", "1.5"],
  ["Peso do SLA", "peso_sla", "2.0"],
  ["Peso de Risco de Atraso", "peso_risco_atraso", "1.8"],
  ["Peso de Glosa", "peso_glosa", "2.2"],
  ["Peso de Complexidade", "peso_complexidade", "1.0"],
  ["Peso do Convênio", "peso_convenio", "1.3"],
  ["Limite de Alerta SLA (%)", "limite_alerta_sla", "75"],
  ["Limite de Risco Alto (%)", "limite_risco_alto", "85"],
  ["Janela de Reordenação (min)", "janela_reordenacao", "15"],
  ["Tolerância de Atraso (min)", "tolerancia_atraso", "30"],
  ["Score Mínimo Auto-Aprovação", "score_min_auto_aprov", "90"],
  ["Score Máximo Auto-Devolução", "score_max_auto_devol", "30"],
  ["Habilita IA na Fila", "habilita_ia_fila", "true"],
  ["Habilita IA no SLA", "habilita_ia_sla", "true"],
  ["Habilita IA na Glosa", "habilita_ia_glosa", "true"],
  ["Modelo IA Padrão", "modelo_ia_padrao", "gemini-2.5-flash"],
  ["Limite de Itens por Lote", "limite_itens_lote", "200"],
  ["Janela de Histórico (dias)", "janela_historico_dias", "180"],
  ["Multiplicador Convênio Premium", "mult_conv_premium", "1.5"],
  ["Penalidade SLA Estourado", "penalidade_sla", "10"],
  ["Bonus Reenvio Rápido", "bonus_reenvio_rapido", "5"],
];

const seed = () =>
  ITEMS.map(([nome, chave, valor], i) => ({
    id: i + 1,
    nome,
    chave,
    valor,
    ...baseAudit(),
  })) as FluxodocsParametroIa[];

export const parametrosIaService = makeMockService<FluxodocsParametroIa>(seed);
