import { useEffect, useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Save, Loader2, X, Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
import { ActionsDropdown } from "@/components/ActionsDropdown";
import {
  CONVENIO_OPTIONS,
  convenioLabel,
  createProdutividade,
  fetchProdutividades,
  inactivateProdutividade,
  updateProdutividade,
} from "@/services/profissionaisProdutividade";
import { fetchProcedimentos } from "@/services/procedimentos";
import { fetchProfissionaisOptions } from "@/services/profissionais";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalProdutividade } from "@/types/entities/ProfissionalProdutividade";
import type { Procedimento } from "@/types/entities/Procedimento";
import type { SelectOption } from "@/types/api";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: Profissional | null;
}

type Mode = "create" | "edit" | "view";

const MOCK_USER_ID = 1;

interface FormState {
  convenioId: string;
  procedimentoId: string;
  situacaoId: string;
  percRecebimento: string;
  percProdCaixa: string;
  percImposto: string;
  vlFixo: string;
  percImpostoCaixa: string;
  percClinica: string;
  fixoClinica: string;
  laudoVlFixo: string;
  terceiroProfissionalId: string;
  terceiroPerc: string;
  vigenciaInicial: string;
  vigenciaFinal: string;
  opcaoDtrecebimentoCalculaProdutividadeVlcaixa: boolean;
  opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio: boolean;
  opcaoDtatendimentoCalculaProdutividadeVlcaixa: boolean;
  opcaoDtatendimentoCalculaProdutividadeVlfaturado: boolean;
  operacaoCreditoOuDebito: string;
  created: string;
  modified: string;
}

const emptyForm = (): FormState => ({
  convenioId: "",
  procedimentoId: "",
  situacaoId: "1",
  percRecebimento: "",
  percProdCaixa: "",
  percImposto: "",
  vlFixo: "",
  percImpostoCaixa: "",
  percClinica: "",
  fixoClinica: "",
  laudoVlFixo: "",
  terceiroProfissionalId: "",
  terceiroPerc: "",
  vigenciaInicial: "",
  vigenciaFinal: "",
  opcaoDtrecebimentoCalculaProdutividadeVlcaixa: false,
  opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio: false,
  opcaoDtatendimentoCalculaProdutividadeVlcaixa: false,
  opcaoDtatendimentoCalculaProdutividadeVlfaturado: false,
  operacaoCreditoOuDebito: "1",
  created: "",
  modified: "",
});

function toForm(p: ProfissionalProdutividade): FormState {
  return {
    convenioId: String(p.convenioId ?? ""),
    procedimentoId: String(p.procedimentoId ?? ""),
    situacaoId: String(p.situacaoId ?? 1),
    percRecebimento: p.percRecebimento?.toString() ?? "",
    percProdCaixa: p.percProdCaixa?.toString() ?? "",
    percImposto: p.percImposto?.toString() ?? "",
    vlFixo: p.vlFixo?.toString() ?? "",
    percImpostoCaixa: p.percImpostoCaixa?.toString() ?? "",
    percClinica: p.percClinica?.toString() ?? "",
    fixoClinica: p.fixoClinica?.toString() ?? "",
    laudoVlFixo: p.laudoVlFixo?.toString() ?? "",
    terceiroProfissionalId: p.terceiroProfissionalId
      ? String(p.terceiroProfissionalId)
      : "",
    terceiroPerc: p.terceiroPerc?.toString() ?? "",
    vigenciaInicial: p.vigenciaInicial ?? "",
    vigenciaFinal: p.vigenciaFinal ?? "",
    opcaoDtrecebimentoCalculaProdutividadeVlcaixa:
      !!p.opcaoDtrecebimentoCalculaProdutividadeVlcaixa,
    opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio:
      !!p.opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio,
    opcaoDtatendimentoCalculaProdutividadeVlcaixa:
      !!p.opcaoDtatendimentoCalculaProdutividadeVlcaixa,
    opcaoDtatendimentoCalculaProdutividadeVlfaturado:
      !!p.opcaoDtatendimentoCalculaProdutividadeVlfaturado,
    operacaoCreditoOuDebito: String(p.operacaoCreditoOuDebito ?? 1),
    created: p.created ?? "",
    modified: p.modified ?? "",
  };
}

const num = (v: string) => (v.trim() === "" ? null : Number(v));

function Hint({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="ml-1 text-xs text-muted-foreground cursor-help">ⓘ</span>
        </TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function ProdutividadeModal({ open, onOpenChange, profissional }: Props) {
  const [list, setList] = useState<ProfissionalProdutividade[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [editingId, setEditingId] = useState<string | number | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm());
  const [activeTab, setActiveTab] = useState("principal");
  const [inactivatingId, setInactivatingId] = useState<
    string | number | null
  >(null);

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [profissionalOpts, setProfissionalOpts] = useState<SelectOption[]>([]);

  const isView = mode === "view";

  async function load() {
    if (!profissional) return;
    setLoading(true);
    try {
      const [items, procs, profs] = await Promise.all([
        fetchProdutividades(profissional.id),
        fetchProcedimentos(),
        fetchProfissionaisOptions(),
      ]);
      setList(items);
      setProcedimentos(procs);
      setProfissionalOpts(
        profs.filter((p) => String(p.id) !== String(profissional.id)),
      );
    } catch {
      toast.error("Erro ao carregar produtividade");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) {
      load();
      resetForm();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, profissional?.id]);

  function resetForm() {
    setForm(emptyForm());
    setMode("create");
    setEditingId(null);
    setActiveTab("principal");
  }

  function loadIntoForm(p: ProfissionalProdutividade, asMode: Mode) {
    setForm(toForm(p));
    setMode(asMode);
    setEditingId(p.id);
    setActiveTab("principal");
  }

  function setF<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    if (!profissional) return;
    if (!form.convenioId) {
      toast.error("O campo Convênio é obrigatório");
      setActiveTab("principal");
      return;
    }
    if (!form.procedimentoId) {
      toast.error("O campo Procedimento é obrigatório");
      setActiveTab("principal");
      return;
    }
    if (!form.situacaoId) {
      toast.error("O campo Situação é obrigatório");
      setActiveTab("principal");
      return;
    }
    if (
      form.vigenciaInicial &&
      form.vigenciaFinal &&
      form.vigenciaFinal < form.vigenciaInicial
    ) {
      toast.error("Vigência Final não pode ser menor que Vigência Inicial");
      setActiveTab("produtividade");
      return;
    }

    const payload = {
      profissionalId: profissional.id,
      convenioId: Number(form.convenioId),
      procedimentoId: Number(form.procedimentoId),
      situacaoId: Number(form.situacaoId),
      percRecebimento: num(form.percRecebimento),
      percProdCaixa: num(form.percProdCaixa),
      percImposto: num(form.percImposto),
      vlFixo: num(form.vlFixo),
      percImpostoCaixa: num(form.percImpostoCaixa),
      percClinica: num(form.percClinica),
      fixoClinica: num(form.fixoClinica),
      laudoVlFixo: num(form.laudoVlFixo),
      terceiroProfissionalId: form.terceiroProfissionalId || null,
      terceiroPerc: num(form.terceiroPerc),
      vigenciaInicial: form.vigenciaInicial || null,
      vigenciaFinal: form.vigenciaFinal || null,
      opcaoDtrecebimentoCalculaProdutividadeVlcaixa:
        form.opcaoDtrecebimentoCalculaProdutividadeVlcaixa,
      opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio:
        form.opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio,
      opcaoDtatendimentoCalculaProdutividadeVlcaixa:
        form.opcaoDtatendimentoCalculaProdutividadeVlcaixa,
      opcaoDtatendimentoCalculaProdutividadeVlfaturado:
        form.opcaoDtatendimentoCalculaProdutividadeVlfaturado,
      operacaoCreditoOuDebito: Number(form.operacaoCreditoOuDebito),
      userId: MOCK_USER_ID,
    };

    setSaving(true);
    try {
      if (mode === "edit" && editingId) {
        await updateProdutividade(editingId, payload);
        toast.success("Produtividade atualizada com sucesso!");
      } else {
        await createProdutividade(payload);
        toast.success("Produtividade cadastrada com sucesso!");
      }
      await load();
      resetForm();
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produtividade",
      );
    } finally {
      setSaving(false);
    }
  }

  async function confirmInactivate() {
    if (!inactivatingId) return;
    try {
      await inactivateProdutividade(inactivatingId);
      toast.success("Registro inativado com sucesso");
      setInactivatingId(null);
      await load();
      resetForm();
    } catch {
      toast.error("Erro ao inativar registro");
    }
  }

  const procedimentoLabel = useMemo(() => {
    const map = new Map(procedimentos.map((p) => [p.id, p.nome]));
    return (id: number) => map.get(id) ?? String(id);
  }, [procedimentos]);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-6xl max-h-[92vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Produtividade do Profissional</DialogTitle>
            <DialogDescription>
              {profissional ? (
                <span>
                  Profissional: <strong>{profissional.nome}</strong>
                </span>
              ) : (
                "Selecione um profissional"
              )}
            </DialogDescription>
          </DialogHeader>

          {/* Form */}
          <div className="rounded-md border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {mode === "edit"
                  ? "Editando produtividade"
                  : mode === "view"
                  ? "Visualizando produtividade"
                  : "Nova produtividade"}
              </h3>
              {(mode === "edit" || mode === "view") && (
                <Button variant="ghost" size="sm" onClick={resetForm}>
                  <X className="mr-1 size-4" />
                  Novo
                </Button>
              )}
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="principal">Dados Principais</TabsTrigger>
                <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
                <TabsTrigger value="config">Configurações</TabsTrigger>
              </TabsList>

              {/* Dados principais */}
              <TabsContent value="principal" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Convênio *</Label>
                    <Select
                      value={form.convenioId}
                      onValueChange={(v) => setF("convenioId", v)}
                      disabled={isView}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {CONVENIO_OPTIONS.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>
                            {c.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Procedimento *</Label>
                    <Select
                      value={form.procedimentoId}
                      onValueChange={(v) => setF("procedimentoId", v)}
                      disabled={isView}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {procedimentos
                          .filter((p) => p.situacaoId === 1)
                          .map((p) => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.nome}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Situação *</Label>
                    <Select
                      value={form.situacaoId}
                      onValueChange={(v) => setF("situacaoId", v)}
                      disabled={isView}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Ativo</SelectItem>
                        <SelectItem value="2">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              {/* Produtividade */}
              <TabsContent value="produtividade" className="mt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <PercField
                    label="% Recebimento"
                    value={form.percRecebimento}
                    onChange={(v) => setF("percRecebimento", v)}
                    disabled={isView}
                  />
                  <PercField
                    label="% Caixa"
                    tooltip="% Produtividade Sobre Valor do Caixa"
                    value={form.percProdCaixa}
                    onChange={(v) => setF("percProdCaixa", v)}
                    disabled={isView}
                  />
                  <PercField
                    label="% Imposto"
                    tooltip="Valor em % Imposto a descontar"
                    value={form.percImposto}
                    onChange={(v) => setF("percImposto", v)}
                    disabled={isView}
                  />
                  <CurrencyField
                    label="Valor Fixo"
                    value={form.vlFixo}
                    onChange={(v) => setF("vlFixo", v)}
                    disabled={isView}
                  />
                  <PercField
                    label="% Imposto Caixa"
                    tooltip="Percentual Imposto Caixa a Descontar"
                    value={form.percImpostoCaixa}
                    onChange={(v) => setF("percImpostoCaixa", v)}
                    disabled={isView}
                  />
                  <PercField
                    label="% Clínica"
                    value={form.percClinica}
                    onChange={(v) => setF("percClinica", v)}
                    disabled={isView}
                  />
                  <CurrencyField
                    label="Vl. Fixo Clínica"
                    tooltip="Valor Fixo Clínica"
                    value={form.fixoClinica}
                    onChange={(v) => setF("fixoClinica", v)}
                    disabled={isView}
                  />
                  <CurrencyField
                    label="Vl. Fixo Laudo"
                    tooltip="Valor Fixo Laudo"
                    value={form.laudoVlFixo}
                    onChange={(v) => setF("laudoVlFixo", v)}
                    disabled={isView}
                  />
                  <div>
                    <Label>Terceiro Profissional</Label>
                    <Select
                      value={form.terceiroProfissionalId}
                      onValueChange={(v) => setF("terceiroProfissionalId", v)}
                      disabled={isView}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        {profissionalOpts.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <PercField
                    label="% Terceiro"
                    value={form.terceiroPerc}
                    onChange={(v) => setF("terceiroPerc", v)}
                    disabled={isView}
                  />
                  <div>
                    <Label>Vigência Inicial</Label>
                    <Input
                      type="date"
                      value={form.vigenciaInicial}
                      onChange={(e) =>
                        setF("vigenciaInicial", e.target.value)
                      }
                      disabled={isView}
                    />
                  </div>
                  <div>
                    <Label>Vigência Final</Label>
                    <Input
                      type="date"
                      value={form.vigenciaFinal}
                      onChange={(e) => setF("vigenciaFinal", e.target.value)}
                      disabled={isView}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Configurações */}
              <TabsContent value="config" className="mt-4 space-y-4">
                <SwitchRow
                  label="Dt. Recebimento calcula produtividade sobre valor caixa?"
                  tooltip="0 - Não | 1 - Sim"
                  checked={form.opcaoDtrecebimentoCalculaProdutividadeVlcaixa}
                  onChange={(v) =>
                    setF("opcaoDtrecebimentoCalculaProdutividadeVlcaixa", v)
                  }
                  disabled={isView}
                />
                <SwitchRow
                  label="Dt. Recebimento calcula produtividade sobre valor recebido convênio?"
                  tooltip="0 - Não | 1 - Sim"
                  checked={
                    form.opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio
                  }
                  onChange={(v) =>
                    setF(
                      "opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio",
                      v,
                    )
                  }
                  disabled={isView}
                />
                <SwitchRow
                  label="Dt. Atendimento calcula produtividade sobre valor caixa?"
                  tooltip="0 - Não | 1 - Sim"
                  checked={form.opcaoDtatendimentoCalculaProdutividadeVlcaixa}
                  onChange={(v) =>
                    setF("opcaoDtatendimentoCalculaProdutividadeVlcaixa", v)
                  }
                  disabled={isView}
                />
                <SwitchRow
                  label="Dt. Atendimento calcula produtividade sobre valor faturado?"
                  tooltip="0 - Não | 1 - Sim"
                  checked={form.opcaoDtatendimentoCalculaProdutividadeVlfaturado}
                  onChange={(v) =>
                    setF(
                      "opcaoDtatendimentoCalculaProdutividadeVlfaturado",
                      v,
                    )
                  }
                  disabled={isView}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div>
                    <Label className="flex items-center">
                      Operação
                      <Hint text="1 = Crédito (Padrão), 2 = Débito" />
                    </Label>
                    <Select
                      value={form.operacaoCreditoOuDebito}
                      onValueChange={(v) =>
                        setF("operacaoCreditoOuDebito", v)
                      }
                      disabled={isView}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">Crédito</SelectItem>
                        <SelectItem value="2">Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Usuário de Cadastro</Label>
                    <Input value={MOCK_USER_ID} readOnly disabled />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label>Criado em</Label>
                      <Input
                        value={
                          form.created
                            ? new Date(form.created).toLocaleString("pt-BR")
                            : "—"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Alterado em</Label>
                      <Input
                        value={
                          form.modified
                            ? new Date(form.modified).toLocaleString("pt-BR")
                            : "—"
                        }
                        readOnly
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-2 border-t">
              {!isView && (
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? (
                    <Loader2 className="mr-1 size-4 animate-spin" />
                  ) : mode === "edit" ? (
                    <Save className="mr-1 size-4" />
                  ) : (
                    <Plus className="mr-1 size-4" />
                  )}
                  {mode === "edit" ? "Salvar" : "Cadastrar"}
                </Button>
              )}
            </div>
          </div>

          {/* Listagem interna */}
          <div className="rounded-md border mt-2">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Convênio</TableHead>
                  <TableHead>Procedimento</TableHead>
                  <TableHead>Vl. Fixo</TableHead>
                  <TableHead>% Recebimento</TableHead>
                  <TableHead>% Imposto</TableHead>
                  <TableHead>Vigência</TableHead>
                  <TableHead>Situação</TableHead>
                  <TableHead className="w-[140px]">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      <Loader2 className="inline size-4 animate-spin mr-2" />
                      Carregando...
                    </TableCell>
                  </TableRow>
                ) : list.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-6 text-muted-foreground"
                    >
                      Nenhuma produtividade cadastrada
                    </TableCell>
                  </TableRow>
                ) : (
                  list.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>{convenioLabel(p.convenioId)}</TableCell>
                      <TableCell>{procedimentoLabel(p.procedimentoId)}</TableCell>
                      <TableCell>
                        {p.vlFixo != null
                          ? `R$ ${Number(p.vlFixo).toFixed(2)}`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {p.percRecebimento != null
                          ? `${p.percRecebimento}%`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {p.percImposto != null ? `${p.percImposto}%` : "—"}
                      </TableCell>
                      <TableCell className="text-xs">
                        {p.vigenciaInicial
                          ? new Date(p.vigenciaInicial).toLocaleDateString(
                              "pt-BR",
                            )
                          : "—"}
                        {p.vigenciaFinal
                          ? ` a ${new Date(p.vigenciaFinal).toLocaleDateString(
                              "pt-BR",
                            )}`
                          : ""}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={p.situacaoId === 1 ? "default" : "secondary"}
                        >
                          {p.situacaoId === 1 ? "Ativo" : "Inativo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ActionsDropdown
                          onEdit={() => loadIntoForm(p, "edit")}
                          onInactivate={() => setInactivatingId(p.id)}
                          customActions={[
                            {
                              icon: <Eye className="mr-2 h-4 w-4" />,
                              label: "Visualizar",
                              onClick: () => loadIntoForm(p, "view"),
                            },
                          ]}
                        />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!inactivatingId}
        onOpenChange={(o) => !o && setInactivatingId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar produtividade?</AlertDialogTitle>
            <AlertDialogDescription>
              O registro será marcado como <strong>Inativo</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmInactivate}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Inativar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function PercField({
  label,
  value,
  onChange,
  tooltip,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  tooltip?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <Label className="flex items-center">
        {label}
        {tooltip && <Hint text={tooltip} />}
      </Label>
      <div className="relative">
        <Input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pr-8"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          %
        </span>
      </div>
    </div>
  );
}

function CurrencyField({
  label,
  value,
  onChange,
  tooltip,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  tooltip?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <Label className="flex items-center">
        {label}
        {tooltip && <Hint text={tooltip} />}
      </Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          R$
        </span>
        <Input
          type="number"
          step="0.01"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="pl-9"
        />
      </div>
    </div>
  );
}

function SwitchRow({
  label,
  tooltip,
  checked,
  onChange,
  disabled,
}: {
  label: string;
  tooltip?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded border p-3">
      <Label className="flex items-center text-sm">
        {label}
        {tooltip && <Hint text={tooltip} />}
      </Label>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
