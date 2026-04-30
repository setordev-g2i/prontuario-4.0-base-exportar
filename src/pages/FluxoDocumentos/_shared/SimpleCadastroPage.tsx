/**
 * SimpleCadastroPage — listagem + modal CRUD genérica para entidades simples.
 *
 * Recebe uma definição de campos e um service (CrudHandle). Renderiza:
 *   - cabeçalho com título/descrição + botão Novo
 *   - busca com debounce (300ms)
 *   - tabela com paginação (PAGE_SIZE = 20)
 *   - ActionsDropdown (Visualizar, Editar, Inativar/Reativar)
 *   - FormModal (Dados Principais + Configurações com auditoria em view)
 *
 * Padrão do projeto: exclusão lógica (situacaoId = 2), camelCase, toasts sonner.
 */
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search, Loader2, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { FormModal } from "@/components/FormModal";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { useDebounce } from "@/hooks/useDebounce";
import { normalize } from "@/lib/normalize";
import { buildPaginationItems } from "@/lib/pagination";
import { cn } from "@/lib/utils";
import type { CrudHandle } from "@/services/fluxodocs/_crud";
import type { AuditMeta } from "@/types/entities/fluxodocs";

const PAGE_SIZE = 20;

export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "color"
  | "switch"
  | "select";

export interface FieldDef<T> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  required?: boolean;
  options?: { id: number | string; value: string }[];
  tooltip?: string;
  placeholder?: string;
  /** Mostrar na coluna de listagem (com este label) */
  inTable?: boolean;
  /** Render customizado na tabela (recebe o registro) */
  renderCell?: (row: T) => React.ReactNode;
  /** Default no formulário ao criar */
  defaultValue?: unknown;
}

interface Props<T extends AuditMeta & { id: number }> {
  title: string;
  description?: string;
  entityLabel: string; // singular: "Setor", "Tipo de Documento"
  service: CrudHandle<T>;
  fields: FieldDef<T>[];
  /** Campos texto pelos quais buscar (default: o primeiro campo string) */
  searchFields?: (keyof T & string)[];
}

export function SimpleCadastroPage<T extends AuditMeta & { id: number }>({
  title,
  description,
  entityLabel,
  service,
  fields,
  searchFields,
}: Props<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [page, setPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [mode, setMode] = useState<"create" | "edit" | "view">("create");
  const [selected, setSelected] = useState<T | null>(null);
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("principal");

  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<"inactivate" | "reactivate">("inactivate");

  /* ── load ── */
  async function load() {
    setLoading(true);
    try {
      const res = await service.list();
      setData(res);
    } catch {
      toast.error(`Erro ao carregar ${entityLabel.toLowerCase()}s`);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  /* ── busca + paginação ── */
  const tableFields = useMemo(() => fields.filter((f) => f.inTable), [fields]);
  const searchKeys = useMemo(
    () =>
      searchFields ??
      (fields.find((f) => f.type === "text")
        ? [fields.find((f) => f.type === "text")!.name]
        : []),
    [fields, searchFields],
  );

  const filtered = useMemo(() => {
    const term = normalize(debounced.trim());
    if (!term) return data;
    return data.filter((row) =>
      searchKeys.some((k) => {
        const v = row[k];
        return typeof v === "string" && normalize(v).includes(term);
      }),
    );
  }, [data, debounced, searchKeys]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);

  function openCreate() {
    setMode("create");
    setSelected(null);
    const init: Record<string, unknown> = {};
    fields.forEach((f) => {
      init[f.name] =
        f.defaultValue !== undefined
          ? f.defaultValue
          : f.type === "switch"
            ? false
            : f.type === "number"
              ? 0
              : f.type === "color"
                ? "#3b82f6"
                : "";
    });
    setForm(init);
    setErrors({});
    setActiveTab("principal");
    setModalOpen(true);
  }

  function openEdit(row: T) {
    setMode("edit");
    setSelected(row);
    const init: Record<string, unknown> = {};
    fields.forEach((f) => {
      init[f.name] = row[f.name] ?? (f.type === "switch" ? false : "");
    });
    setForm(init);
    setErrors({});
    setActiveTab("principal");
    setModalOpen(true);
  }

  function openView(row: T) {
    setMode("view");
    setSelected(row);
    const init: Record<string, unknown> = {};
    fields.forEach((f) => { init[f.name] = row[f.name]; });
    setForm(init);
    setErrors({});
    setActiveTab("principal");
    setModalOpen(true);
  }

  function setField(name: string, value: unknown) {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    let firstMissing = "";
    fields.forEach((f) => {
      if (!f.required) return;
      const v = form[f.name];
      const empty =
        v === undefined ||
        v === null ||
        (typeof v === "string" && v.trim() === "") ||
        (typeof v === "number" && Number.isNaN(v));
      if (empty) {
        errs[f.name] = "Obrigatório";
        if (!firstMissing) firstMissing = f.label;
      }
    });
    setErrors(errs);
    if (firstMissing) {
      toast.error(`O campo ${firstMissing} é obrigatório`);
      setActiveTab("principal");
      return false;
    }
    return true;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (mode === "view") return;
    if (!validate()) return;

    setSubmitting(true);
    try {
      const payload: Record<string, unknown> = {};
      fields.forEach((f) => {
        let v = form[f.name];
        if (f.type === "number" && typeof v === "string") {
          v = v === "" ? null : Number(v);
        }
        payload[f.name] = v;
      });

      if (mode === "create") {
        await service.create(payload as never);
        toast.success(`${entityLabel} cadastrado com sucesso!`);
      } else if (mode === "edit" && selected) {
        await service.update(selected.id, payload as Partial<T>);
        toast.success(`${entityLabel} atualizado com sucesso!`);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : `Erro ao salvar ${entityLabel.toLowerCase()}`,
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmInativacao() {
    if (confirmId == null) return;
    try {
      if (confirmAction === "inactivate") {
        await service.inactivate(confirmId);
        toast.success(`${entityLabel} inativado com sucesso!`);
      } else {
        await service.reactivate(confirmId);
        toast.success(`${entityLabel} reativado com sucesso!`);
      }
      setConfirmId(null);
      await load();
    } catch {
      toast.error("Não foi possível concluir a ação");
    }
  }

  /* ── helpers de render ── */
  function renderField(f: FieldDef<T>) {
    const v = form[f.name];
    const err = errors[f.name];
    const disabled = mode === "view" || submitting;
    const errClass = err ? "border-destructive" : "";
    const id = `fld-${f.name}`;

    if (f.type === "switch") {
      return (
        <div className="flex items-center justify-between rounded-md border p-3">
          <div>
            <Label className="text-sm">{f.label}{f.required && " *"}</Label>
            {f.tooltip && <p className="text-xs text-muted-foreground">{f.tooltip}</p>}
          </div>
          <Switch
            checked={!!v}
            onCheckedChange={(val) => setField(f.name, val)}
            disabled={disabled}
          />
        </div>
      );
    }

    if (f.type === "select") {
      return (
        <div>
          <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
          <Select
            value={v == null || v === "" ? "" : String(v)}
            onValueChange={(val) => {
              const opt = f.options?.find((o) => String(o.id) === val);
              setField(f.name, opt && typeof opt.id === "number" ? opt.id : val);
            }}
            disabled={disabled}
          >
            <SelectTrigger id={id} className={errClass}>
              <SelectValue placeholder={f.placeholder ?? "Selecione"} />
            </SelectTrigger>
            <SelectContent>
              {f.options?.map((o) => (
                <SelectItem key={String(o.id)} value={String(o.id)}>
                  {o.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {f.tooltip && <p className="text-xs text-muted-foreground mt-1">{f.tooltip}</p>}
        </div>
      );
    }

    if (f.type === "textarea") {
      return (
        <div className="md:col-span-2">
          <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
          <textarea
            id={id}
            value={(v as string) ?? ""}
            onChange={(e) => setField(f.name, e.target.value)}
            disabled={disabled}
            rows={3}
            className={cn(
              "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
              errClass,
            )}
          />
          {f.tooltip && <p className="text-xs text-muted-foreground mt-1">{f.tooltip}</p>}
        </div>
      );
    }

    if (f.type === "color") {
      return (
        <div>
          <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
          <div className="flex items-center gap-2">
            <Input
              id={id}
              type="color"
              value={(v as string) ?? "#3b82f6"}
              onChange={(e) => setField(f.name, e.target.value)}
              disabled={disabled}
              className={cn("h-10 w-16 p-1", errClass)}
            />
            <Input
              value={(v as string) ?? ""}
              onChange={(e) => setField(f.name, e.target.value)}
              disabled={disabled}
              className="flex-1"
            />
          </div>
        </div>
      );
    }

    return (
      <div>
        <Label htmlFor={id}>{f.label}{f.required && " *"}</Label>
        <Input
          id={id}
          type={f.type === "number" ? "number" : "text"}
          value={v == null ? "" : String(v)}
          onChange={(e) => setField(f.name, e.target.value)}
          placeholder={f.placeholder}
          disabled={disabled}
          className={errClass}
        />
        {f.tooltip && <p className="text-xs text-muted-foreground mt-1">{f.tooltip}</p>}
      </div>
    );
  }

  const auditTab = mode === "view" && selected
    ? (
      <div className="space-y-3">
        <h4 className="text-sm font-semibold">Informações do Registro</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div><span className="text-muted-foreground">ID:</span> {selected.id}</div>
          <div><span className="text-muted-foreground">Situação:</span> {selected.situacaoId === 1 ? "Ativo" : "Inativo"}</div>
          <div><span className="text-muted-foreground">Criado por (ID):</span> {selected.userCreatedId ?? "—"}</div>
          <div><span className="text-muted-foreground">Criado em:</span> {selected.created ? new Date(selected.created).toLocaleString("pt-BR") : "—"}</div>
          <div><span className="text-muted-foreground">Modificado por (ID):</span> {selected.userModifiedId ?? "—"}</div>
          <div><span className="text-muted-foreground">Modificado em:</span> {selected.modified ? new Date(selected.modified).toLocaleString("pt-BR") : "—"}</div>
        </div>
      </div>
    ) : null;

  const tabs = [
    {
      id: "principal",
      label: "Dados Principais",
      content: (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((f) => (
              <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
                {renderField(f)}
              </div>
            ))}
          </div>
          {mode !== "view" && (
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)} disabled={submitting}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting}>
                {submitting && <Loader2 className="mr-1 size-4 animate-spin" />}
                {mode === "create" ? "Cadastrar" : "Salvar"}
              </Button>
            </div>
          )}
        </form>
      ),
    },
    ...(auditTab ? [{ id: "audit", label: "Configurações", content: auditTab }] : []),
  ];

  const modalTitle =
    mode === "create"
      ? `Novo ${entityLabel}`
      : mode === "edit"
        ? `Editar ${entityLabel}`
        : `Visualizar ${entityLabel}`;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          {description && <p className="text-sm text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={openCreate}>
          <Plus className="mr-1 size-4" />
          Novo {entityLabel}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listagem</CardTitle>
          <div className="relative mt-2 max-w-sm">
            <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder="Buscar..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">ID</TableHead>
                  {tableFields.map((f) => (
                    <TableHead key={f.name}>{f.label}</TableHead>
                  ))}
                  <TableHead className="w-[110px]">Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={tableFields.length + 3} className="text-center py-8">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={tableFields.length + 3} className="text-center py-8 text-muted-foreground">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-mono text-xs">{row.id}</TableCell>
                      {tableFields.map((f) => (
                        <TableCell key={f.name}>
                          {f.renderCell ? f.renderCell(row) : String(row[f.name] ?? "—")}
                        </TableCell>
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
                            setConfirmId(row.id);
                            setConfirmAction(row.situacaoId === 1 ? "inactivate" : "reactivate");
                          }}
                          inactivateLabel={row.situacaoId === 1 ? "Inativar" : "Reativar"}
                          customActions={
                            row.situacaoId === 2
                              ? [{
                                  icon: <RotateCcw className="mr-2 h-4 w-4" />,
                                  label: "Reativar",
                                  onClick: () => {
                                    setConfirmId(row.id);
                                    setConfirmAction("reactivate");
                                  },
                                }]
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

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Exibindo {total === 0 ? 0 : start + 1}-{Math.min(start + PAGE_SIZE, total)} de {total}
            </p>
            {totalPages > 1 && (
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={safePage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  {buildPaginationItems(safePage, totalPages).map((it, i) =>
                    it === "ellipsis" ? (
                      <PaginationItem key={`e-${i}`}><PaginationEllipsis /></PaginationItem>
                    ) : (
                      <PaginationItem key={it}>
                        <PaginationLink
                          isActive={it === safePage}
                          onClick={() => setPage(it)}
                          className="cursor-pointer"
                        >
                          {it}
                        </PaginationLink>
                      </PaginationItem>
                    ),
                  )}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={safePage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>

      <FormModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={modalTitle}
        tabs={tabs}
        defaultTab="principal"
      />

      <AlertDialog open={confirmId != null} onOpenChange={(o) => !o && setConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction === "inactivate" ? `Inativar ${entityLabel.toLowerCase()}?` : `Reativar ${entityLabel.toLowerCase()}?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction === "inactivate"
                ? "O registro será marcado como Inativo (exclusão lógica)."
                : "O registro voltará a ficar Ativo."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmInativacao}
              className={confirmAction === "inactivate" ? "bg-destructive text-destructive-foreground hover:bg-destructive/90" : ""}
            >
              {confirmAction === "inactivate" ? "Inativar" : "Reativar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
