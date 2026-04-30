import { makeMockService, baseAudit } from "./_factory";
import type { FluxodocsSetor } from "@/types/entities/Fluxodocs";

const NOMES = [
  "Faturamento", "Recepção", "Internação", "Auditoria Médica", "Auditoria de Convênio",
  "Cobrança", "Financeiro", "Recursos de Glosa", "Centro Cirúrgico", "Pronto Socorro",
  "UTI Adulto", "UTI Neonatal", "Ambulatório", "Farmácia", "Almoxarifado",
  "TI", "RH", "Diretoria", "Comercial", "SAC",
  "Compras", "Contabilidade", "Jurídico",
];
const SIGLAS = ["FAT","REC","INT","AMD","ACV","COB","FIN","RGL","CCI","PSC","UTA","UTN","AMB","FAR","ALM","TI","RH","DIR","COM","SAC","CMP","CTB","JUR"];
const CORES = ["#3b82f6","#10b981","#8b5cf6","#ef4444","#f59e0b","#ec4899","#14b8a6","#06b6d4","#6366f1","#a855f7","#0ea5e9","#22c55e","#eab308","#f43f5e","#84cc16","#dc2626","#fb923c","#60a5fa","#f472b6","#34d399","#94a3b8","#facc15","#9333ea"];

const seed = () =>
  NOMES.map((nome, i) => ({
    id: i + 1,
    nome,
    sigla: SIGLAS[i],
    cor: CORES[i],
    responsavelId: null,
    participaFluxo: i < 12,
    ...baseAudit(),
  })) as FluxodocsSetor[];

export const setoresService = makeMockService<FluxodocsSetor>(seed);
