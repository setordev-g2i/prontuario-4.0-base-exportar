import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2, Info, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionsDropdown, type CustomAction } from "@/components/ActionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { normalize } from "@/lib/search";
import type { FluxodocsBase } from "@/types/entities/Fluxodocs";
import type { CrudConfig, CrudField, FieldOption } from "./types";
import { CrudFormModal } from "./CrudFormModal";
import { CrudViewDrawer } from "./CrudViewDrawer";

type Mode = "create" | "edit";

interface Props<T extends FluxodocsBase> {
  config: CrudConfig<T>;
}

const PAGE_SIZE = 20;

export function CrudPage<T extends FluxodocsBase>({ config }: Props<T>) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<T[]>([]);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<Mode>("create");
  const [selected, setSelected] = useState<T | null>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [viewItem, setViewItem] = useState<T | null>(null);

  const [actingId, setActingId] = useState<number | null>(null);
  const [actingTo, setActingTo] = useState<"inactivate" | "reactivate">("inactivate");

  /** Cache de options das FKs para evitar refetch ao renderizar a lista */
  const [optionsCache, setOptionsCache] = useState<Record<string, FieldOption[]>>({});

  async function load() {
    setLoading(true);
    try {
      const res = await config.service.fetchAll();
      setData(res);
    } catch {
      toast.error(`Erro ao carregar ${config.titlePlural.toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // Pré-carrega options de FKs visíveis na lista
    const fkFields = config.fields.filter(
      (f) => f.type === "select" && f.optionsSource && !f.hideInList,
    );
    Promise.all(
      fkFields.map(async (f) => [f.key, await f.optionsSource!()] as const),
    ).then((entries) => {
      setOptionsCache(Object.fromEntries(entries));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config.entity]);

  function openCreate() {
    setSelected(null);
    setModalMode("create");
    setModalOpen(true);
  }
  function openEdit(item: T) {
    setSelected(item);
    setModalMode("edit");
    setModalOpen(true);
  }
  function openView(item: T) {
    setViewItem(item);
    setViewOpen(true);
  }

  async function confirmAction() {
    if (actingId == null) return;
    try {
      if (actingTo === "inactivate") {
        await config.service.inactivate(actingId);
        toast.success("Registro inativado com sucesso");
      } else {
        await config.service.reactivate(actingId);
        toast.success("Registro reativado com sucesso");
      }
      setActingId(null);
      load();
    } catch {
      toast.error("Erro ao alterar situação");
    }
  }

  const visibleFields = useMemo(
    () => config.fields.filter((f) => !f.hideInList),
    [config.fields],
  );

  const filtered = useMemo(() => {
    const term = normalize(debounced.trim());
    if (!term) return data;
    return data.filter((row) => {
      // busca pelo searchKey + qualquer campo string
      const candidates: string[] = [];
      for (const f of config.fields) {
        const v = row[f.key];
        if (typeof v === "string") candidates.push(v);
        if (typeof v === "number") candidates.push(String(v));
      }
      return candidates.some((c) => normalize(c).includes(term));
    });
  }, [data, debounced, config.fields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function renderCell(field: CrudField<T>, row: T) {
    const value = row[field.key];
    if (field.formatList) return field.formatList(value, row as Record<string, unknown>);
    if (field.type === "boolean") {
      return (
        <Badge variant={value ? "default" : "secondary"}>
          {value ? "Sim" : "Não"}
        </Badge>
      );
    }
    if (field.type === "color" && typeof value === "string") {
      return (
        <div className="flex items-center gap-2">
          <span className="inline-block size-3 rounded-full border" style={{ backgroundColor: value }} />
          <span className="text-xs text-muted-foreground">{value}</span>
        </div>
      );
    }
    if (field.type === "select" && (typeof value === "number" || value === null)) {
      const opts = optionsCache[field.key];
      if (value === null) return <span className="text-muted-foreground">—</span>;
      const found = opts?.find((o) => o.id === value);
      return found?.value ?? `#${value}`;
    }
    if (value === null || value === undefined || value === "") {
      return <span className="text-muted-foreground">—</span>;
    }
    return String(value);
  }

  return (
    <TooltipProvider>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">{config.titlePlural}</h1>
              {config.tooltip && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{config.tooltip}</TooltipContent>
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Cadastro do módulo Fluxo de Documentos
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="mr-1 size-4" />
            Novo
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{config.titleSingular} — listagem</CardTitle>
            <div className="relative mt-2 max-w-sm">
              <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
              <Input
                className="pl-8"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    {visibleFields.map((f) => (
                      <TableHead key={f.key}>{f.label}</TableHead>
                    ))}
                    <TableHead className="w-[120px]">Situação</TableHead>
                    <TableHead className="w-[140px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleFields.length + 2}
                        className="text-center py-8"
                      >
                        <Loader2 className="inline size-4 animate-spin mr-2" />
                        Carregando...
                      </TableCell>
                    </TableRow>
                  ) : pageData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={visibleFields.length + 2}
                        className="text-center py-8 text-muted-foreground"
                      >
                        Nenhum registro encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    pageData.map((row) => (
                      <TableRow key={row.id}>
                        {visibleFields.map((f) => (
                          <TableCell key={f.key}>{renderCell(f, row)}</TableCell>
                        ))}
                        <TableCell>
                          <Badge variant={row.situacaoId === 1 ? "default" : "secondary"}>
                            {row.situacaoId === 1 ? "Ativo" : "Inativo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <ActionsDropdown
                            onView={() => openView(row)}
                            onEdit={() => openEdit(row)}
                            onInactivate={() => {
                              setActingId(row.id);
                              setActingTo("inactivate");
                            }}
                            inactivateLabel={row.situacaoId === 1 ? "Inativar" : "Inativar"}
                            customActions={
                              row.situacaoId === 2
                                ? ([
                                    {
                                      icon: <RotateCcw className="mr-2 h-4 w-4" />,
                                      label: "Reativar",
                                      onClick: () => {
                                        setActingId(row.id);
                                        setActingTo("reactivate");
                                      },
                                    },
                                  ] as CustomAction[])
                                : undefined
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!loading && filtered.length > 0 && (
              <div className="flex items-center justify-between mt-3 text-sm text-muted-foreground">
                <span>
                  Exibindo {(page - 1) * PAGE_SIZE + 1}-
                  {Math.min(page * PAGE_SIZE, filtered.length)} de {filtered.length}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                  >
                    Anterior
                  </Button>
                  <span className="px-2 py-1">
                    {page}/{totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages}
                  >
                    Próximo
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <CrudFormModal<T>
          open={modalOpen}
          onOpenChange={setModalOpen}
          mode={modalMode}
          item={selected}
          config={config}
          onSaved={load}
        />

        <CrudViewDrawer<T>
          open={viewOpen}
          onOpenChange={setViewOpen}
          item={viewItem}
          config={config}
          optionsCache={optionsCache}
        />

        <AlertDialog
          open={actingId != null}
          onOpenChange={(o) => !o && setActingId(null)}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {actingTo === "inactivate" ? "Inativar registro?" : "Reativar registro?"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {actingTo === "inactivate"
                  ? "O registro será marcado como Inativo (exclusão lógica)."
                  : "O registro voltará a ficar Ativo no sistema."}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAction}
                className={
                  actingTo === "inactivate"
                    ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    : ""
                }
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
}
