import { IMaskInput } from "react-imask";
import { cn } from "@/lib/utils";

interface InputMaskedProps {
  mask: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
}

export function InputMasked({
  mask,
  value,
  onChange,
  placeholder,
  hasError,
  disabled,
  className,
  id,
}: InputMaskedProps) {
  return (
    <IMaskInput
      id={id}
      mask={mask}
      value={value}
      unmask={false}
      onAccept={(v: string) => onChange(v)}
      placeholder={placeholder}
      disabled={disabled}
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        hasError && "border-destructive focus-visible:ring-destructive",
        className,
      )}
    />
  );
}
