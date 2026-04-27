import type { FieldErrors, FieldValues } from "react-hook-form";
import { toast } from "sonner";

/**
 * Exibe um toast com o label do primeiro campo inválido no submit.
 * Uso:
 *   <form onSubmit={handleSubmit(onSubmit, (errs) => notifyRequiredErrors(errs, LABELS))}>
 */
export function notifyRequiredErrors<T extends FieldValues>(
  errors: FieldErrors<T>,
  labels: Record<string, string>,
) {
  const keys = Object.keys(errors);
  if (keys.length === 0) return;
  const first = keys[0];
  const label = labels[first] ?? first;
  const err = errors[first] as { type?: string; message?: string } | undefined;
  const isRequired =
    !err?.type ||
    err.type === "required" ||
    err.type === "too_small" ||
    /obrigat/i.test(err.message ?? "");
  if (isRequired) {
    toast.error(`O campo ${label} é obrigatório`);
  } else {
    toast.error(`${label}: ${err?.message ?? "inválido"}`);
  }
}
