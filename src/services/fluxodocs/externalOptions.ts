/**
 * Mock options para entidades externas (não-fluxodocs) usadas em FKs.
 * Quando o backend existir, esses retornos virão dos services reais.
 */

const CONVENIOS = [
  "Unimed", "Bradesco Saúde", "Amil", "SulAmérica", "Hapvida", "NotreDame Intermédica",
  "Porto Seguro Saúde", "Cassi", "GEAP", "Allianz Saúde", "Particular",
  "SUS", "Cabesp", "Petrobras", "Postal Saúde", "Trasmontano",
  "Mediservice", "Care Plus", "Omint", "Prevent Senior", "Saúde Bradesco",
];

const USERS = [
  "Admin", "Maria Silva", "João Santos", "Ana Costa", "Pedro Lima", "Carla Souza",
  "Lucas Pereira", "Juliana Almeida", "Rafael Oliveira", "Beatriz Rodrigues",
  "Felipe Martins", "Mariana Ribeiro", "Gabriel Carvalho", "Camila Ferreira",
  "Diego Gomes", "Larissa Barbosa", "Thiago Araújo", "Patrícia Dias",
  "Rodrigo Nunes", "Vanessa Cardoso", "Eduardo Pinto",
];

const CLIENTES = [
  "José da Silva", "Maria Souza", "Antônio Pereira", "Ana Oliveira", "Carlos Lima",
  "Mariana Costa", "Paulo Santos", "Juliana Almeida", "Fernando Rodrigues", "Camila Ferreira",
  "Roberto Carvalho", "Patrícia Gomes", "Marcos Ribeiro", "Cláudia Martins", "Rogério Dias",
  "Sandra Nunes", "Bruno Cardoso", "Adriana Pinto", "Gustavo Araújo", "Vanessa Barbosa",
  "Henrique Mendes",
];

const CONTAS = Array.from({ length: 21 }, (_, i) => `Conta #${1000 + i}`);
const ATENDIMENTOS = Array.from({ length: 21 }, (_, i) => `Atend. #${5000 + i}`);

function toOpts(arr: string[]) {
  return arr.map((value, i) => ({ id: i + 1, value }));
}

export async function fetchConveniosOptions() {
  return toOpts(CONVENIOS);
}
export async function fetchUsersOptions() {
  return toOpts(USERS);
}
export async function fetchClientesOptions() {
  return toOpts(CLIENTES);
}
export async function fetchContasOptions() {
  return toOpts(CONTAS);
}
export async function fetchAtendimentosOptions() {
  return toOpts(ATENDIMENTOS);
}
