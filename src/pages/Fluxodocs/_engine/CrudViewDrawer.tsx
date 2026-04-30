import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import type { FluxodocsBase } from "@/types/entities/Fluxodocs";
import type { CrudConfig, FieldOption } from "./types";

interface Props<T extends FluxodocsBase> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: T | null;
  config: CrudConfig<T>;
  optionsCache: Record<string, FieldOption[]>;
}

function fmtDate(v: unknown) {
  if (!v || typeof v !== "string") return "—";
  try {
    return new Date(v).toLocaleString("pt-BR");
  } catch {
    return v;
  }
}

export function CrudViewDrawer<T extends FluxodocsBase>({
  open,
  onOpenChange,
  item,
  config,
  optionsCache,
}: Props<T>) {
  if (!item) return null;

  function render(value: unknown, type: string, key?: string): React.ReactNode {
    if (value === null || value === undefined || value === "") return <span className="text-muted-foreground">—</span>;
    if (type === "boolean") {
      return <Badge variant={value ? "default" : "secondary"}>{value ? "Sim" : "Não"}</Badge>;
    }
    if (type === "color" && typeof value === "string") {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-block size-4 rounded-full border" style={{ backgroundColor: value }} />
          <span className="text-xs text-muted-foreground">{value}</span>
        </div>
      );
    }
    if (type === "select" && typeof value === "number" && key) {
      const opt = optionsCache[key]?.find((o) => o.id === value);
      return opt?.value ?? `#${value}`;
    }
    if (type === "datetime") return fmtDate(value);
    return String(value);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Detalhes — {config.titleSingular}</SheetTitle>
          <SheetDescription>
            ID: <span className="font-mono">{item.id}</span>
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">Dados do registro</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {config.fields.map((f) => (
              <div key={f.key} className="space-y-0.5">
                <div className="text-xs font-medium text-muted-foreground">{f.label}</div>
                <div className="text-sm break-words">
                  {render(item[f.key], f.type, f.key)}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t pt-4 mt-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3">
              Informações do Registro
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <div className="text-xs font-medium text-muted-foreground">Situação</div>
                <Badge variant={item.situacaoId === 1 ? "default" : "secondary"}>
                  {item.situacaoId === 1 ? "Ativo" : "Inativo"}
                </Badge>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Usuário criação</div>
                <div>{item.userCreatedId ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Criado em</div>
                <div>{fmtDate(item.created)}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Usuário modificação</div>
                <div>{item.userModifiedId ?? "—"}</div>
              </div>
              <div>
                <div className="text-xs font-medium text-muted-foreground">Modificado em</div>
                <div>{fmtDate(item.modified)}</div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
