import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Save, Plus, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  CONVENIO_OPTIONS,
  createProdutividade,
  updateProdutividade,
} from "@/services/profissionaisProdutividade";
import { fetchProcedimentos } from "@/services/procedimentos";
import { fetchGruposProcedimentos } from "@/services/gruposProcedimentos";
import { fetchProfissionaisOptions } from "@/services/profissionais";
import type { Profissional } from "@/types/entities/Profissional";
import type { ProfissionalProdutividade } from "@/types/entities/ProfissionalProdutividade";
import type { Procedimento } from "@/types/entities/Procedimento";
import type { GrupoProcedimento } from "@/types/entities/GrupoProcedimento";
import type { SelectOption } from "@/types/api";

export type ProdutividadeFormMode = "create" | "edit" | "view";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profissional: Profissional | null;
  mode: ProdutividadeFormMode;
  initial: ProfissionalProdutividade | null;
  onSaved: () => void;
}

const MOCK_USER_ID = 1;

interface FormState {
  alvo: "procedimento" | "grupo";
  convenioId: string;
  procedimentoId: string;
  grupoId: string;
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
  alvo: "procedimento",
  convenioId: "",
  procedimentoId: "",
  grupoId: "",
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

function fromEntity(p: ProfissionalProdutividade): FormState {
  return {
    alvo: "procedimento",
    convenioId: String(p.convenioId ?? ""),
    procedimentoId: String(p.procedimentoId ?? ""),
    grupoId: "",
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

export function ProdutividadeFormModal({
  open,
  onOpenChange,
  profissional,
  mode,
  initial,
  onSaved,
}: Props) {
  const [form, setForm] = useState<FormState>(emptyForm());
  const [activeTab, setActiveTab] = useState("principal");
  const [saving, setSaving] = useState(false);

  const [procedimentos, setProcedimentos] = useState<Procedimento[]>([]);
  const [grupos, setGrupos] = useState<GrupoProcedimento[]>([]);
  const [profissionalOpts, setProfissionalOpts] = useState<SelectOption[]>([]);

  const isView = mode === "view";
  const isEdit = mode === "edit";

  useEffect(() => {
    if (!open) return;
    setActiveTab("principal");
    if ((mode === "edit" || mode === "view") && initial) {
      setForm(fromEntity(initial));
    } else {
      setForm(emptyForm());
    }
    (async () => {
      try {
        const [procs, grps, profs] = await Promise.all([
          fetchProcedimentos(),
          fetchGruposProcedimentos(),
          fetchProfissionaisOptions(),
        ]);
        setProcedimentos(procs);
        setGrupos(grps);
        setProfissionalOpts(
          profissional
            ? profs.filter((p) => String(p.id) !== String(profissional.id))
            : profs,
        );
      } catch {
        toast.error("Erro ao carregar listas de apoio");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode, initial?.id]);

  function setF<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function buildPayloadBase() {
    return {
      profissionalId: profissional!.id,
      convenioId: Number(form.convenioId),
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
  }

  async function handleSave() {
    if (!profissional) return;
    if (!form.convenioId) {
      toast.error("O campo Convênio é obrigatório");
      setActiveTab("principal");
      return;
    }
    if (!isEdit && form.alvo === "grupo" && !form.grupoId) {
      toast.error("Selecione um Grupo");
      setActiveTab("principal");
      return;
    }
    if ((isEdit || form.alvo === "procedimento") && !form.procedimentoId) {
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

    setSaving(true);
    try {
      if (isEdit && initial) {
        await updateProdutividade(initial.id, {
          ...buildPayloadBase(),
          procedimentoId: Number(form.procedimentoId),
        });
        toast.success("Produtividade atualizada com sucesso!");
      } else if (form.alvo === "grupo") {
        const grupoId = Number(form.grupoId);
        const procsDoGrupo = procedimentos.filter(
          (p) => p.grupoId === grupoId && p.situacaoId === 1,
        );
        if (procsDoGrupo.length === 0) {
          toast.error("Nenhum procedimento ativo neste grupo");
          setSaving(false);
          return;
        }
        let ok = 0;
        let skip = 0;
        for (const proc of procsDoGrupo) {
          try {
            await createProdutividade({
              ...buildPayloadBase(),
              procedimentoId: Number(proc.id),
            });
            ok++;
          } catch {
            skip++;
          }
        }
        toast.success(
          `${ok} produtividade(s) cadastrada(s)` +
            (skip > 0 ? ` • ${skip} ignorada(s) por duplicidade` : ""),
        );
      } else {
        await createProdutividade({
          ...buildPayloadBase(),
          procedimentoId: Number(form.procedimentoId),
        });
        toast.success("Produtividade cadastrada com sucesso!");
      }
      onSaved();
      onOpenChange(false);
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar produtividade",
      );
    } finally {
      setSaving(false);
    }
  }

  const title =
    mode === "view"
      ? "Visualizar Produtividade"
      : isEdit
      ? "Editar Produtividade"
      : "Nova Produtividade";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {profissional ? (
              <span>
                Profissional: <strong>{profissional.nome}</strong>
              </span>
            ) : null}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="principal">Dados Principais</TabsTrigger>
            <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
            <TabsTrigger value="config">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="principal" className="mt-4 space-y-4">
            {!isEdit && !isView && (
              <div className="rounded border p-3">
                <Label className="mb-2 block">Cadastrar por</Label>
                <RadioGroup
                  value={form.alvo}
                  onValueChange={(v) =>
                    setF("alvo", v as "procedimento" | "grupo")
                  }
                  className="flex gap-6"
                >
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="procedimento" id="alvo-proc" />
                    <Label htmlFor="alvo-proc" className="cursor-pointer">
                      Procedimento
                    </Label>
                  </div>
                  <div className="flex items-center gap-2">
                    <RadioGroupItem value="grupo" id="alvo-grupo" />
                    <Label htmlFor="alvo-grupo" className="cursor-pointer">
                      Grupo (gera para todos os procedimentos ativos)
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            )}

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

              {!isEdit && !isView && form.alvo === "grupo" ? (
                <div>
                  <Label>Grupo *</Label>
                  <Select
                    value={form.grupoId}
                    onValueChange={(v) => setF("grupoId", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {grupos
                        .filter((g) => g.situacaoId === 1)
                        .map((g) => (
                          <SelectItem key={g.id} value={String(g.id)}>
                            {g.nome}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              ) : (
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
              )}

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

          <TabsContent value="produtividade" className="mt-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <PercField label="% Recebimento" value={form.percRecebimento}
                onChange={(v) => setF("percRecebimento", v)} disabled={isView} />
              <PercField label="% Caixa" tooltip="% Produtividade Sobre Valor do Caixa"
                value={form.percProdCaixa} onChange={(v) => setF("percProdCaixa", v)} disabled={isView} />
              <PercField label="% Imposto" tooltip="Valor em % Imposto a descontar"
                value={form.percImposto} onChange={(v) => setF("percImposto", v)} disabled={isView} />
              <CurrencyField label="Valor Fixo" value={form.vlFixo}
                onChange={(v) => setF("vlFixo", v)} disabled={isView} />
              <PercField label="% Imposto Caixa" tooltip="Percentual Imposto Caixa a Descontar"
                value={form.percImpostoCaixa} onChange={(v) => setF("percImpostoCaixa", v)} disabled={isView} />
              <PercField label="% Clínica" value={form.percClinica}
                onChange={(v) => setF("percClinica", v)} disabled={isView} />
              <CurrencyField label="Vl. Fixo Clínica" tooltip="Valor Fixo Clínica"
                value={form.fixoClinica} onChange={(v) => setF("fixoClinica", v)} disabled={isView} />
              <CurrencyField label="Vl. Fixo Laudo" tooltip="Valor Fixo Laudo"
                value={form.laudoVlFixo} onChange={(v) => setF("laudoVlFixo", v)} disabled={isView} />
              <div>
                <Label>Terceiro Profissional</Label>
                <Select value={form.terceiroProfissionalId}
                  onValueChange={(v) => setF("terceiroProfissionalId", v)} disabled={isView}>
                  <SelectTrigger><SelectValue placeholder="Selecione..." /></SelectTrigger>
                  <SelectContent>
                    {profissionalOpts.map((p) => (
                      <SelectItem key={p.id} value={String(p.id)}>{p.value}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <PercField label="% Terceiro" value={form.terceiroPerc}
                onChange={(v) => setF("terceiroPerc", v)} disabled={isView} />
              <div>
                <Label>Vigência Inicial</Label>
                <Input type="date" value={form.vigenciaInicial}
                  onChange={(e) => setF("vigenciaInicial", e.target.value)} disabled={isView} />
              </div>
              <div>
                <Label>Vigência Final</Label>
                <Input type="date" value={form.vigenciaFinal}
                  onChange={(e) => setF("vigenciaFinal", e.target.value)} disabled={isView} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="config" className="mt-4 space-y-4">
            <SwitchRow
              label="Dt. Recebimento calcula produtividade sobre valor caixa?"
              tooltip="0 - Não | 1 - Sim"
              checked={form.opcaoDtrecebimentoCalculaProdutividadeVlcaixa}
              onChange={(v) => setF("opcaoDtrecebimentoCalculaProdutividadeVlcaixa", v)}
              disabled={isView}
            />
            <SwitchRow
              label="Dt. Recebimento calcula produtividade sobre valor recebido convênio?"
              tooltip="0 - Não | 1 - Sim"
              checked={form.opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio}
              onChange={(v) =>
                setF("opcaoDtrecebimentoCalculaProdutividadeVlrecebidoConvenio", v)
              }
              disabled={isView}
            />
            <SwitchRow
              label="Dt. Atendimento calcula produtividade sobre valor caixa?"
              tooltip="0 - Não | 1 - Sim"
              checked={form.opcaoDtatendimentoCalculaProdutividadeVlcaixa}
              onChange={(v) => setF("opcaoDtatendimentoCalculaProdutividadeVlcaixa", v)}
              disabled={isView}
            />
            <SwitchRow
              label="Dt. Atendimento calcula produtividade sobre valor faturado?"
              tooltip="0 - Não | 1 - Sim"
              checked={form.opcaoDtatendimentoCalculaProdutividadeVlfaturado}
              onChange={(v) => setF("opcaoDtatendimentoCalculaProdutividadeVlfaturado", v)}
              disabled={isView}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div>
                <Label className="flex items-center">
                  Operação
                  <Hint text="1 = Crédito (Padrão), 2 = Débito" />
                </Label>
                <Select value={form.operacaoCreditoOuDebito}
                  onValueChange={(v) => setF("operacaoCreditoOuDebito", v)} disabled={isView}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
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
                    value={form.created ? new Date(form.created).toLocaleString("pt-BR") : "—"}
                    readOnly disabled
                  />
                </div>
                <div>
                  <Label>Alterado em</Label>
                  <Input
                    value={form.modified ? new Date(form.modified).toLocaleString("pt-BR") : "—"}
                    readOnly disabled
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            {isView ? "Fechar" : "Cancelar"}
          </Button>
          {!isView && (
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <Loader2 className="mr-1 size-4 animate-spin" />
              ) : isEdit ? (
                <Save className="mr-1 size-4" />
              ) : (
                <Plus className="mr-1 size-4" />
              )}
              Salvar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PercField({ label, value, onChange, tooltip, disabled }: {
  label: string; value: string; onChange: (v: string) => void; tooltip?: string; disabled?: boolean;
}) {
  return (
    <div>
      <Label className="flex items-center">{label}{tooltip && <Hint text={tooltip} />}</Label>
      <div className="relative">
        <Input type="number" step="0.01" value={value}
          onChange={(e) => onChange(e.target.value)} disabled={disabled} className="pr-8" />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">%</span>
      </div>
    </div>
  );
}

function CurrencyField({ label, value, onChange, tooltip, disabled }: {
  label: string; value: string; onChange: (v: string) => void; tooltip?: string; disabled?: boolean;
}) {
  return (
    <div>
      <Label className="flex items-center">{label}{tooltip && <Hint text={tooltip} />}</Label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">R$</span>
        <Input type="number" step="0.01" value={value}
          onChange={(e) => onChange(e.target.value)} disabled={disabled} className="pl-9" />
      </div>
    </div>
  );
}

function SwitchRow({ label, tooltip, checked, onChange, disabled }: {
  label: string; tooltip?: string; checked: boolean; onChange: (v: boolean) => void; disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded border p-3">
      <Label className="flex items-center text-sm">{label}{tooltip && <Hint text={tooltip} />}</Label>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}
