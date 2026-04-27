/**
 * Gera array de itens para paginação com ellipsis.
 */
export function buildPaginationItems(
  currentPage: number,
  totalPages: number,
): (number | "ellipsis")[] {
  const delta = 2;
  const range: (number | "ellipsis")[] = [];

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      range.push(i);
    } else if (range[range.length - 1] !== "ellipsis") {
      range.push("ellipsis");
    }
  }

  return range;
}
