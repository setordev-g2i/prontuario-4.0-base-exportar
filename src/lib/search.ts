import { normalize } from "@/lib/normalize";

/**
 * Padrão de filtro de listagens:
 *  - normalize: lowercase + sem acento (para comparar nomes)
 *  - onlyDigits: extrai dígitos (para comparar CPF/telefone/documentos)
 *
 * Uso típico:
 *   const { term, digits } = parseSearchTerm(search);
 *   list.filter(item =>
 *     normalize(item.nome).includes(term) ||
 *     item.cpf.replace(/\D/g, "").includes(digits),
 *   );
 */
export function parseSearchTerm(raw: string) {
  const term = normalize(raw.trim());
  const digits = term.replace(/\D/g, "");
  return { term, digits };
}

export function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export { normalize };
