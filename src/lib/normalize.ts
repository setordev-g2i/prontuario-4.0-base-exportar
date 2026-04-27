/**
 * Normaliza string para busca (remove acentos e converte para minúsculo).
 */
export function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
