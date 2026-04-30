/**
 * Helpers de UI genéricos para o módulo Fluxo de Documentos.
 *
 * Cada entidade declara um conjunto de "fields" descrevendo seus campos
 * (tipo, label, opções de FK, render, etc.) e os componentes abaixo geram
 * automaticamente listagem, filtros, formulários (criar/editar) e visualização
 * — mantendo padrão visual e regras (auditoria oculta no form, situação por ação,
 * tooltips, ActionsDropdown, paginação, busca).
 */
import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import { ActionsDropdown } from "@/components/ActionsDropdown";
import { ViewModal } from "@/components/ViewModal";
import { useDebounce } from "@/hooks/useDebounce";
import { normalize } from "@/lib/normalize";
import { buildPaginationItems } from "@/lib/pagination";
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from "@/components/ui/pagination";
import { Plus, Search, Info, RotateCcw } from "lucide-react";
import type { FluxodocsService } from "@/lib/fluxodocs/createService";
import type { FluxodocsAudit } from "@/types/entities/Fluxodocs";

const PAGE_SIZE = 10;

export type FieldType =
  | "text" | "number" | "textarea" | "select" | "boolean" | "color" | "date";

export interface FieldDef<T> {
  name: keyof T & string;
  label: string;
  type: FieldType;
  required?: boolean;
  tooltip?: string;
  options?: { id: number | string; value: string }[];
  /** opcional: render customizado na listagem */
  renderList?: (row: T) => React.ReactNode;
  /** se true, esconde do formulário (apenas listagem/visualização) */
  readOnly?: boolean;
  placeholder?: string;
}

export interface EntityConfig<T extends FluxodocsAudit> {
  /** Singular usado em títulos: "Setor" */
  singular: string;
  /** Plural usado em títulos/listagem: "Setores" */
  plural: string;
  service: FluxodocsService<T>;
  fields: FieldDef<T>[];
  /** Colunas a exibir na listagem (default: primeiras 4 fields). */
  listColumns?: (keyof T & string)[];
  /** Campo principal usado na busca livre. */
  searchableFields?: (keyof T & string)[];
  /** Default values para create. */
  defaults?: Partial<Omit<T, keyof FluxodocsAudit>>;
}

function FieldHint({ tooltip }: { tooltip?: string }) {
  if (!tooltip) return null;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="inline-flex"><Info className="h-3.5 w-3.5 text-muted-foreground" /></span>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

function FieldInput<T extends FluxodocsAudit>({
  field, value, onChange,
}: {
  field: FieldDef<T>;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const id = `f-${field.name}`;
  const labelEl = (
    <Label htmlFor={id} className="flex items-center gap-1.5">
      {field.label}
      {field.required && <span className="text-destructive">*</span>}
      <FieldHint tooltip={field.tooltip} />
    </Label>
  );

  if (field.type === "textarea") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <Textarea
          id={id}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
        />
      </div>
    );
  }

  if (field.type === "boolean") {
    return (
      <div className="flex items-center justify-between rounded border px-3 py-2">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{field.label}</span>
          <FieldHint tooltip={field.tooltip} />
        </div>
        <Switch checked={Boolean(value)} onCheckedChange={onChange} />
      </div>
    );
  }

  if (field.type === "select") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <Select
          value={value !== null && value !== undefined ? String(value) : ""}
          onValueChange={(v) => {
            const opt = field.options?.find((o) => String(o.id) === v);
            onChange(opt ? (typeof opt.id === "number" ? Number(opt.id) : opt.id) : null);
          }}
        >
          <SelectTrigger id={id}>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            {field.options?.map((o) => (
              <SelectItem key={String(o.id)} value={String(o.id)}>
                {o.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  if (field.type === "color") {
    return (
      <div className="space-y-1.5">
        {labelEl}
        <div className="flex items-center gap-2">
          <input
            type="color"
            id={id}
            value={(value as string) || "#3b82f6"}
            onChange={(e) => onChange(e.target.value)}
            className="h-9 w-12 cursor-pointer rounded border"
          />
          <Input
            value={(value as string) ?? ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder="#000000"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {labelEl}
      <Input
        id={id}
        type={field.type === "number" ? "number" : field.type === "date" ? "date" : "text"}
        value={value !== null && value !== undefined ? String(value) : ""}
        onChange={(e) => {
          const raw = e.target.value;
          if (field.type === "number") {
            onChange(raw === "" ? null : Number(raw));
          } else {
            onChange(raw);
          }
        }}
        placeholder={field.placeholder}
      />
    </div>
  );
}

function renderCellValue<T extends FluxodocsAudit>(field: FieldDef<T>, row: T): React.ReactNode {
  if (field.renderList) return field.renderList(row);
  const v = row[field.name];
  if (field.type === "boolean") return v ? "Sim" : "Não";
  if (field.type === "color" && typeof v === "string") {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="h-4 w-4 rounded border" style={{ background: v }} />
        <span className="text-xs text-muted-foreground">{v}</span>
      </span>
    );
  }
  if (field.type === "select" && field.options) {
    const opt = field.options.find((o) => String(o.id) === String(v));
    return opt?.value ?? (v != null ? String(v) : "—");
  }
  return v != null && v !== "" ? String(v) : "—";
}

/* ============================================================
 * FluxodocsCrudPage — montagem completa: filtros + listagem + form modal + visualização
 * Cada entidade renderiza apenas <FluxodocsCrudPage config={...} />.
 * ============================================================ */
export interface CrudPageProps<T extends FluxodocsAudit> {
  config: EntityConfig<T>;
}

export function FluxodocsCrudPage<T extends FluxodocsAudit>({ config }: CrudPageProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const debounced = useDebounce(search, 300);
  const [showInactive, setShowInactive] = useState(false);
  const [page, setPage] = useState(1);

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<T | null>(null);
  const [viewing, setViewing] = useState<T | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await config.service.fetchAll();
      setData(res);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);
  useEffect(() => { setPage(1); }, [debounced, showInactive]);

  const searchableFields = config.searchableFields ?? config.fields
    .filter((f) => f.type === "text" || f.type === "textarea")
    .map((f) => f.name);

  const filtered = useMemo(() => {
    let list = data;
    if (!showInactive) list = list.filter((r) => r.situacaoId === 1);
    if (debounced.trim()) {
      const q = normalize(debounced);
      list = list.filter((r) =>
        searchableFields.some((k) => normalize(String(r[k] ?? ""))
          .includes(q)),
      );
    }
    return list;
  }, [data, debounced, showInactive, searchableFields]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const listColumns = config.listColumns ?? config.fields.slice(0, 4).map((f) => f.name);

  async function handleSave(values: Partial<T>, id?: number) {
    try {
      if (id) {
        await config.service.update(id, values as never);
        toast.success(`${config.singular} atualizado(a) com sucesso!`);
      } else {
        await config.service.create(values as never);
        toast.success(`${config.singular} cadastrado(a) com sucesso!`);
      }
      setEditing(null);
      setCreateOpen(false);
      await load();
    } catch (e) {
      toast.error(`Erro ao salvar ${config.singular.toLowerCase()}`);
    }
  }

  async function handleInactivate(row: T) {
    if (!confirm(`Deseja realmente inativar este registro?`)) return;
    await config.service.inactivate(row.id);
    toast.success("Registro inativado com sucesso!");
    await load();
  }

  async function handleReactivate(row: T) {
    await config.service.reactivate(row.id);
    toast.success("Registro reativado com sucesso!");
    await load();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">{config.plural}</h1>
          <p className="text-sm text-muted-foreground">
            Gerenciamento de {config.plural.toLowerCase()} do módulo Fluxo de Documentos.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="h-4 w-4 mr-2" /> Novo
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3 items-start md:items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={`Buscar ${config.plural.toLowerCase()}...`}
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch id="show-inactive" checked={showInactive} onCheckedChange={setShowInactive} />
          <Label htmlFor="show-inactive" className="text-sm">Mostrar inativos</Label>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {listColumns.map((col) => {
                const f = config.fields.find((x) => x.name === col);
                return <TableHead key={col}>{f?.label ?? col}</TableHead>;
              })}
              <TableHead>Situação</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={listColumns.length + 2}>Carregando...</TableCell></TableRow>
            ) : pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={listColumns.length + 2} className="text-center text-muted-foreground py-8">
                  Nenhum registro encontrado.
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((row) => (
                <TableRow key={row.id}>
                  {listColumns.map((col) => {
                    const f = config.fields.find((x) => x.name === col);
                    return (
                      <TableCell key={col}>
                        {f ? renderCellValue(f, row) : String(row[col] ?? "—")}
                      </TableCell>
                    );
                  })}
                  <TableCell>
                    {row.situacaoId === 1
                      ? <Badge variant="default">Ativo</Badge>
                      : <Badge variant="secondary">Inativo</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    {row.situacaoId === 1 ? (
                      <ActionsDropdown
                        onView={() => setViewing(row)}
                        onEdit={() => setEditing(row)}
                        onInactivate={() => handleInactivate(row)}
                      />
                    ) : (
                      <Button
                        variant="outline" size="sm"
                        onClick={() => handleReactivate(row)}
                      >
                        <RotateCcw className="h-4 w-4 mr-1" /> Reativar
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.max(1, p - 1)); }}
              />
            </PaginationItem>
            {buildPaginationItems(page, totalPages).map((item, i) =>
              item === "..." ? (
                <PaginationItem key={i}><PaginationEllipsis /></PaginationItem>
              ) : (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#" isActive={page === item}
                    onClick={(e) => { e.preventDefault(); setPage(item); }}
                  >
                    {item}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => { e.preventDefault(); setPage((p) => Math.min(totalPages, p + 1)); }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}

      <FluxodocsFormModal
        open={createOpen || !!editing}
        onOpenChange={(o) => { if (!o) { setCreateOpen(false); setEditing(null); } }}
        title={editing ? `Editar ${config.singular}` : `Novo(a) ${config.singular}`}
        fields={config.fields}
        initial={editing ?? (config.defaults as Partial<T>) ?? {}}
        onSubmit={(values) => handleSave(values, editing?.id)}
      />

      {viewing && (
        <ViewModal
          open={!!viewing}
          onOpenChange={(o) => { if (!o) setViewing(null); }}
          title={`Visualizar ${config.singular}`}
          tabs={[
            {
              id: "main", label: "Dados",
              fields: config.fields.map((f) => ({
                label: f.label,
                value: renderCellValue(f, viewing),
              })),
            },
            {
              id: "audit", label: "Informações do Registro",
              fields: [
                { label: "ID", value: viewing.id },
                { label: "Situação", value: viewing.situacaoId === 1 ? "Ativo" : "Inativo" },
                { label: "Usuário criação", value: viewing.userCreatedId ?? "—" },
                { label: "Criado em", value: new Date(viewing.created).toLocaleString("pt-BR") },
                { label: "Usuário alteração", value: viewing.userModifiedId ?? "—" },
                { label: "Alterado em", value: new Date(viewing.modified).toLocaleString("pt-BR") },
              ],
            },
          ]}
        />
      )}
    </div>
  );
}

/* ============================================================
 * FluxodocsFormModal — usado por Create e Edit (mesmo modal).
 * ============================================================ */
function FluxodocsFormModal<T extends FluxodocsAudit>({
  open, onOpenChange, title, fields, initial, onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  title: string;
  fields: FieldDef<T>[];
  initial: Partial<T>;
  onSubmit: (values: Partial<T>) => void;
}) {
  const [values, setValues] = useState<Partial<T>>(initial);
  useEffect(() => { setValues(initial); }, [initial, open]);

  function submit() {
    for (const f of fields) {
      if (f.required && (values[f.name] === undefined || values[f.name] === null || values[f.name] === "")) {
        toast.error(`O campo ${f.label} é obrigatório`);
        return;
      }
    }
    onSubmit(values);
  }

  const editableFields = fields.filter((f) => !f.readOnly);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Preencha os campos obrigatórios. Campos de auditoria são preenchidos automaticamente.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
          {editableFields.map((f) => (
            <div key={f.name} className={f.type === "textarea" ? "md:col-span-2" : ""}>
              <FieldInput
                field={f}
                value={values[f.name]}
                onChange={(v) => setValues((prev) => ({ ...prev, [f.name]: v }))}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-3 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={submit}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
