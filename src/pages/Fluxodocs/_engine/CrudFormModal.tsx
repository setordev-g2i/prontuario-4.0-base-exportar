import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info, Loader2 } from "lucide-react";
import type { FluxodocsBase } from "@/types/entities/Fluxodocs";
import type { CrudConfig, FieldOption } from "./types";

interface Props<T extends FluxodocsBase> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  item: T | null;
  config: CrudConfig<T>;
  onSaved: () => void;
}

export function CrudFormModal<T extends FluxodocsBase>({
  open,
  onOpenChange,
  mode,
  item,
  config,
  onSaved,
}: Props<T>) {
  const [form, setForm] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [optionsCache, setOptionsCache] = useState<Record<string, FieldOption[]>>({});
  const [loadingOpts, setLoadingOpts] = useState(false);

  // Inicializa form
  useEffect(() => {
    if (!open) return;
    if (mode === "edit" && item) {
      const initial: Record<string, unknown> = {};
      for (const f of config.fields) initial[f.key] = item[f.key];
      setForm(initial);
    } else {
      const initial: Record<string, unknown> = {};
      for (const f of config.fields) {
        if (f.type === "boolean") initial[f.key] = false;
        else if (f.type === "number") initial[f.key] = 0;
        else if (f.type === "select") initial[f.key] = f.nullable ? null : "";
        else initial[f.key] = "";
      }
      setForm(initial);
    }
    setErrors({});
  }, [open, mode, item, config.fields]);

  // Carrega options de selects
  useEffect(() => {
    if (!open) return;
    const selects = config.fields.filter(
      (f) => f.type === "select" && f.optionsSource && !f.hideInForm,
    );
    if (selects.length === 0) return;
    setLoadingOpts(true);
    Promise.all(
      selects.map(async (f) => [f.key, await f.optionsSource!()] as const),
    )
      .then((entries) => setOptionsCache(Object.fromEntries(entries)))
      .finally(() => setLoadingOpts(false));
  }, [open, config.fields]);

  function setField(key: string, value: unknown) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  }

  function validate(): boolean {
    const next: Record<string, string> = {};
    for (const f of config.fields) {
      if (f.hideInForm) continue;
      if (f.required) {
        const v = form[f.key];
        if (v === null || v === undefined || v === "" || (f.type === "number" && isNaN(Number(v)))) {
          next[f.key] = `O campo ${f.label} é obrigatório`;
        }
      }
    }
    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error(Object.values(next)[0]);
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      // Coerções básicas
      const payload: Record<string, unknown> = {};
      for (const f of config.fields) {
        if (f.hideInForm) continue;
        let v = form[f.key];
        if (f.type === "number") v = v === "" || v === null ? null : Number(v);
        if (f.type === "select" && v === "") v = f.nullable ? null : v;
        payload[f.key] = v;
      }
      if (mode === "create") {
        await config.service.create(payload as Partial<T>);
        toast.success(`${config.titleSingular} cadastrado com sucesso!`);
      } else if (item) {
        await config.service.update(item.id, payload as Partial<T>);
        toast.success(`${config.titleSingular} atualizado com sucesso!`);
      }
      onSaved();
      onOpenChange(false);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  const visible = config.fields.filter((f) => !f.hideInForm);

  return (
    <TooltipProvider>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {mode === "create" ? `Novo ${config.titleSingular}` : `Editar ${config.titleSingular}`}
            </DialogTitle>
            <DialogDescription>
              {mode === "create"
                ? `Preencha os dados para cadastrar um novo registro.`
                : `Altere os dados do registro selecionado.`}
            </DialogDescription>
          </DialogHeader>

          {loadingOpts ? (
            <div className="py-8 text-center text-muted-foreground">
              <Loader2 className="inline size-4 animate-spin mr-2" />
              Carregando opções...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
              {visible.map((f) => {
                const span = f.span ?? (f.type === "textarea" ? 3 : 1);
                const colClass =
                  span === 3 ? "md:col-span-3" : span === 2 ? "md:col-span-2" : "md:col-span-1";
                const err = errors[f.key];
                const errorBorder = err ? "border-destructive" : "";

                return (
                  <div key={f.key} className={`space-y-1 ${colClass}`}>
                    <div className="flex items-center gap-1">
                      <Label htmlFor={f.key} className="text-xs">
                        {f.label}
                        {f.required && <span className="text-destructive ml-0.5">*</span>}
                      </Label>
                      {f.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="size-3 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">{f.tooltip}</TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {f.type === "text" || f.type === "color" || f.type === "datetime" ? (
                      <Input
                        id={f.key}
                        type={f.type === "color" ? "color" : f.type === "datetime" ? "datetime-local" : "text"}
                        value={(form[f.key] as string) ?? ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className={errorBorder}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === "number" ? (
                      <Input
                        id={f.key}
                        type="number"
                        value={(form[f.key] as number | string) ?? ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className={errorBorder}
                        placeholder={f.placeholder}
                      />
                    ) : f.type === "textarea" ? (
                      <Textarea
                        id={f.key}
                        value={(form[f.key] as string) ?? ""}
                        onChange={(e) => setField(f.key, e.target.value)}
                        className={errorBorder}
                        placeholder={f.placeholder}
                        rows={3}
                      />
                    ) : f.type === "boolean" ? (
                      <div className="flex items-center gap-2 pt-1">
                        <Switch
                          id={f.key}
                          checked={Boolean(form[f.key])}
                          onCheckedChange={(v) => setField(f.key, v)}
                        />
                        <span className="text-sm text-muted-foreground">
                          {form[f.key] ? "Sim" : "Não"}
                        </span>
                      </div>
                    ) : f.type === "select" ? (
                      <Select
                        value={
                          form[f.key] === null || form[f.key] === undefined || form[f.key] === ""
                            ? ""
                            : String(form[f.key])
                        }
                        onValueChange={(v) => setField(f.key, v === "__null" ? null : Number(v))}
                      >
                        <SelectTrigger className={errorBorder}>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {f.nullable && <SelectItem value="__null">— Nenhum —</SelectItem>}
                          {(optionsCache[f.key] ?? []).map((o) => (
                            <SelectItem key={o.id} value={String(o.id)}>
                              {o.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : null}

                    {err && <p className="text-xs text-destructive">{err}</p>}
                  </div>
                );
              })}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={saving || loadingOpts}>
              {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
              {mode === "create" ? "Cadastrar" : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}
