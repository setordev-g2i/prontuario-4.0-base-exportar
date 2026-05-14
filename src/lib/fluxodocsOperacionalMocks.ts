/**
 * Mocks de dados operacionais (clientes/atendimentos/contas/convênios)
 * + estado mutável dos fluxos operacionais. Apenas dados, sem UI.
 */
import type {
  ClienteMock,
  ConvenioMock,
  AtendimentoMock,
  ContaMock,
} from "@/types/entities/FluxodocsOperacional";

export const clientesMock: ClienteMock[] = Array.from({ length: 30 }).map((_, i) => ({
  id: i + 1,
  nome: [
    "Maria Silva", "João Pereira", "Ana Costa", "Carlos Souza", "Beatriz Lima",
    "Felipe Rocha", "Patrícia Nunes", "Rafael Almeida", "Camila Dias", "Bruno Martins",
    "Larissa Ribeiro", "Eduardo Castro", "Juliana Pires", "Tiago Mendes", "Sofia Araújo",
    "Lucas Carvalho", "Gabriela Teixeira", "Marcelo Lopes", "Renata Barros", "André Ramos",
    "Isabela Cardoso", "Henrique Mota", "Bianca Freitas", "Vinícius Cunha", "Letícia Pinto",
    "Roberto Vieira", "Aline Sanches", "Gustavo Borges", "Natália Faria", "Diego Moraes",
  ][i],
  cpf: `${String(100 + i).padStart(3, "0")}.${String(200 + i).padStart(3, "0")}.${String(300 + i).padStart(3, "0")}-${String(i % 100).padStart(2, "0")}`,
  dataNascimento: `19${60 + (i % 40)}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 27) + 1).padStart(2, "0")}`,
}));

export const conveniosMock: ConvenioMock[] = [
  { id: 1, nome: "Unimed Nacional", registroAns: "393321", historicoGlosa: 0.18, historicoAtraso: 0.22 },
  { id: 2, nome: "Bradesco Saúde", registroAns: "005711", historicoGlosa: 0.12, historicoAtraso: 0.30 },
  { id: 3, nome: "SulAmérica", registroAns: "006246", historicoGlosa: 0.25, historicoAtraso: 0.18 },
  { id: 4, nome: "Amil", registroAns: "326305", historicoGlosa: 0.32, historicoAtraso: 0.45 },
  { id: 5, nome: "Hapvida", registroAns: "368253", historicoGlosa: 0.21, historicoAtraso: 0.27 },
  { id: 6, nome: "NotreDame Intermédica", registroAns: "359017", historicoGlosa: 0.19, historicoAtraso: 0.24 },
  { id: 7, nome: "Porto Seguro", registroAns: "417173", historicoGlosa: 0.14, historicoAtraso: 0.16 },
  { id: 8, nome: "Particular", registroAns: "-", historicoGlosa: 0.05, historicoAtraso: 0.08 },
];

export const atendimentosMock: AtendimentoMock[] = Array.from({ length: 40 }).map((_, i) => ({
  id: i + 1,
  numero: `AT-${String(800000 + i).padStart(7, "0")}`,
  clienteId: (i % clientesMock.length) + 1,
  convenioId: i % 8 === 0 ? null : (i % conveniosMock.length) + 1,
  data: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  tipo: ["Consulta", "Exame", "Internação", "Cirurgia", "Pronto Atendimento"][i % 5],
}));

export const contasMock: ContaMock[] = Array.from({ length: 35 }).map((_, i) => {
  const at = atendimentosMock[i % atendimentosMock.length];
  return {
    id: i + 1,
    numero: `CT-${String(500000 + i).padStart(7, "0")}`,
    clienteId: at.clienteId,
    atendimentoId: at.id,
    convenioId: at.convenioId ?? ((i % 7) + 1),
    valor: 250 + (i * 137) % 8500,
    emissao: at.data,
  };
});

// Estado mutável compartilhado dos fluxos (protocolos extras criados via wizard)
import type { FluxodocsProtocolo, FluxodocsProtocoloItem, FluxodocsLog } from "@/types/entities/Fluxodocs";

export const protocolosOperacionais: FluxodocsProtocolo[] = [];
export const itensOperacionais: FluxodocsProtocoloItem[] = [];
export const logsOperacionais: FluxodocsLog[] = [];

let seqProtocolo = 5000;
let seqItem = 8000;
let seqLog = 9000;

export function nextProtocoloId() { return ++seqProtocolo; }
export function nextItemId() { return ++seqItem; }
export function nextLogId() { return ++seqLog; }

export function gerarNumeroFluxo(id: number): string {
  const ano = new Date().getFullYear();
  return `FLUXO-${ano}-${String(id).padStart(4, "0")}`;
}
