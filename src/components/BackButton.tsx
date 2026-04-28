import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BackButtonProps {
  /** Rota de fallback quando não há histórico (padrão: "/"). */
  fallback?: string;
  label?: string;
  className?: string;
}

/**
 * Voltar inteligente:
 *  - se existe histórico do navegador, faz navigate(-1)
 *  - caso contrário, vai para `fallback`
 */
export function BackButton({
  fallback = "/",
  label = "Voltar",
  className,
}: BackButtonProps) {
  const navigate = useNavigate();

  function handleClick() {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate(fallback);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleClick}
      className={cn("gap-1", className)}
    >
      <ArrowLeft className="size-4" />
      {label}
    </Button>
  );
}
