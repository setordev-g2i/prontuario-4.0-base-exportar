import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import {
  grupoProcedimentoSchema,
  GRUPO_PROCEDIMENTO_FIELD_LABELS,
  type GrupoProcedimentoFormValues,
} from "@/lib/schemas/grupoProcedimento";
import {
  SUBGRUPO_OPTIONS,
  TIPO_DATA_FATURAMENTO_OPTIONS,
  CAPITULO_CONVENIO_OPTIONS,
  type GrupoProcedimento,
} from "@/types/entities/GrupoProcedimento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DicomModalitySelector } from "./DicomModalitySelector";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import { Loader2, Save, X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifyRequiredErrors } from "@/lib/forms/notifyRequired";

export type GrupoProcedimentoFormMode = "create" | "edit";

interface Props {
  mode: GrupoProcedimentoFormMode;
  initialData?: Partial<GrupoProcedimentoFormValues>;
  meta?: Pick<GrupoProcedimento, "userId" | "created" | "modified"> | null;
  onSubmit: (values: GrupoProcedimentoFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
  readOnly?: boolean;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

const defaultValues: GrupoProcedimentoFormValues = {
  codigoGrupo: "",
  nome: "",
  situacaoId: 1,
  color: "#3b82f6",
  procedimentoSubGrupoId: 1,
  percentualLucro: null,
  percentualDesconto: null,
  tipoDataFaturamento: null,
  faturaTabelaConvenioCapituloId: null,
  contabilidadeCodreduzido: "",
  utilizaInternacaoMapaImpressaoColunaAcomodacao: false,
  utilizaInternacaoMapaImpressaoColunaProcedimentos: false,
  relProducaoTotalizaMedico: false,
  relProducaoTotalizaMatmed: false,
  relProducaoRelExecutante: false,
  relProducaoRelSolicitante: false,
  homecareNomeGrupoRelatorio: "",
  homecareOrdemOrcamento: null,
  homecareListaEquipamentoRequisitar: false,
  modalidadedicom: "",
};

function HelpTip({ text }: { text: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button type="button" className="ml-1 inline-flex">
            <HelpCircle className="size-3.5 text-muted-foreground" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs">{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
  tooltip: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center text-sm">
        <span>{label}</span>
        <HelpTip text={tooltip} />
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

export function GrupoProcedimentoForm({
  mode,
  initialData,
  meta,
  onSubmit,
  onCancel,
  submitting = false,
  readOnly = false,
  activeTab,
  onActiveTabChange,
}: Props) {
  const form = useForm<GrupoProcedimentoFormValues>({
    resolver: zodResolver(grupoProcedimentoSchema),
    mode: "onChange",
    defaultValues: { ...defaultValues, ...initialData },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const disabled = readOnly;

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        notifyRequiredErrors(errs, GRUPO_PROCEDIMENTO_FIELD_LABELS),
      )}
      className="space-y-4"
    >
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="principal">Dados Principais</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="homecare">Home Care</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        {/* ─── Dados Principais ─── */}
        <TabsContent value="principal" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="codigoGrupo" className="flex items-center">
                Código *
                <HelpTip text="Código interno para identificação do grupo de procedimentos." />
              </Label>
              <Input
                id="codigoGrupo"
                disabled={disabled}
                {...register("codigoGrupo")}
                className={cn(errors.codigoGrupo && "border-destructive")}
              />
            </div>

            <div>
              <Label htmlFor="nome" className="flex items-center">
                Nome *
                <HelpTip text="Nome do grupo de procedimentos." />
              </Label>
              <Input
                id="nome"
                disabled={disabled}
                {...register("nome")}
                className={cn(errors.nome && "border-destructive")}
              />
            </div>

            <div>
              <Label>Situação *</Label>
              <Controller
                control={control}
                name="situacaoId"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v) as 1 | 2)}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(errors.situacaoId && "border-destructive")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Ativo</SelectItem>
                      <SelectItem value="2">Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="color" className="flex items-center">
                Cor *
                <HelpTip text="Cor usada para identificação visual do grupo." />
              </Label>
              <Controller
                control={control}
                name="color"
                render={({ field }) => (
                  <div className="flex items-center gap-2">
                    <Input
                      id="color"
                      type="color"
                      value={field.value || "#3b82f6"}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={disabled}
                      className={cn(
                        "h-10 w-16 p-1",
                        errors.color && "border-destructive",
                      )}
                    />
                    <Input
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      disabled={disabled}
                      className="flex-1"
                    />
                  </div>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Label className="flex items-center">
                Subgrupo de Procedimento *
                <HelpTip text="Subgrupo relacionado a este grupo de procedimentos." />
              </Label>
              <Controller
                control={control}
                name="procedimentoSubGrupoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(
                        errors.procedimentoSubGrupoId && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBGRUPO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── Faturamento ─── */}
        <TabsContent value="faturamento" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="percentualLucro" className="flex items-center">
                Percentual de Lucro
                <HelpTip text="Percentual de lucro aplicado ao grupo." />
              </Label>
              <div className="relative">
                <Input
                  id="percentualLucro"
                  type="number"
                  step="0.01"
                  disabled={disabled}
                  {...register("percentualLucro", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined
                        ? null
                        : Number(v),
                  })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div>
              <Label htmlFor="percentualDesconto" className="flex items-center">
                Percentual de Desconto
                <HelpTip text="Percentual máximo de desconto permitido." />
              </Label>
              <div className="relative">
                <Input
                  id="percentualDesconto"
                  type="number"
                  step="0.01"
                  disabled={disabled}
                  {...register("percentualDesconto", {
                    setValueAs: (v) =>
                      v === "" || v === null || v === undefined
                        ? null
                        : Number(v),
                  })}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </div>

            <div>
              <Label className="flex items-center">
                Tipo de Data para Faturamento
                <HelpTip text="Define qual data será usada como referência no faturamento." />
              </Label>
              <Controller
                control={control}
                name="tipoDataFaturamento"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(v ? (Number(v) as 1 | 2 | 3) : null)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPO_DATA_FATURAMENTO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label className="flex items-center">
                Capítulo da Tabela de Convênio
                <HelpTip text="Capítulo usado para agrupamento na tabela de convênio." />
              </Label>
              <Controller
                control={control}
                name="faturaTabelaConvenioCapituloId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) =>
                      field.onChange(v ? Number(v) : null)
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAPITULO_CONVENIO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Label
                htmlFor="contabilidadeCodreduzido"
                className="flex items-center"
              >
                Código Contábil Reduzido
                <HelpTip text="Código contábil usado em relatórios ou integrações financeiras." />
              </Label>
              <Input
                id="contabilidadeCodreduzido"
                disabled={disabled}
                {...register("contabilidadeCodreduzido")}
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── Relatórios ─── */}
        <TabsContent value="relatorios" className="mt-4">
          <div className="grid gap-3">
            <Controller
              control={control}
              name="utilizaInternacaoMapaImpressaoColunaAcomodacao"
              render={({ field }) => (
                <SwitchRow
                  label="Ocultar Coluna Acomodação no Mapa Cirúrgico?"
                  tooltip="Quando ativado, oculta a coluna de acomodação no relatório do mapa cirúrgico."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="utilizaInternacaoMapaImpressaoColunaProcedimentos"
              render={({ field }) => (
                <SwitchRow
                  label="Ocultar Coluna Procedimentos no Mapa Cirúrgico?"
                  tooltip="Quando ativado, oculta a coluna de procedimentos no relatório do mapa cirúrgico."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="relProducaoTotalizaMedico"
              render={({ field }) => (
                <SwitchRow
                  label="Totaliza Médico no Relatório de Produção?"
                  tooltip="Define se o relatório de produção totaliza valores por médico."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="relProducaoTotalizaMatmed"
              render={({ field }) => (
                <SwitchRow
                  label="Totaliza Mat/Med no Relatório de Produção?"
                  tooltip="Define se o relatório de produção totaliza materiais e medicamentos."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="relProducaoRelExecutante"
              render={({ field }) => (
                <SwitchRow
                  label="Relatório por Executante?"
                  tooltip="Considera este grupo no relatório por profissional executante."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="relProducaoRelSolicitante"
              render={({ field }) => (
                <SwitchRow
                  label="Relatório por Solicitante?"
                  tooltip="Considera este grupo no relatório por profissional solicitante."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
          </div>
        </TabsContent>

        {/* ─── Home Care ─── */}
        <TabsContent value="homecare" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label
                htmlFor="homecareNomeGrupoRelatorio"
                className="flex items-center"
              >
                Nome no Relatório Home Care
                <HelpTip text="Nome usado para agrupar procedimentos Home Care em relatórios." />
              </Label>
              <Input
                id="homecareNomeGrupoRelatorio"
                disabled={disabled}
                {...register("homecareNomeGrupoRelatorio")}
              />
            </div>
            <div>
              <Label
                htmlFor="homecareOrdemOrcamento"
                className="flex items-center"
              >
                Ordem no Orçamento
                <HelpTip text="Ordem de exibição do grupo no orçamento Home Care." />
              </Label>
              <Input
                id="homecareOrdemOrcamento"
                type="number"
                step="1"
                disabled={disabled}
                {...register("homecareOrdemOrcamento", {
                  setValueAs: (v) =>
                    v === "" || v === null || v === undefined
                      ? null
                      : Number.parseInt(v, 10),
                })}
              />
            </div>
            <div className="md:col-span-2">
              <Controller
                control={control}
                name="homecareListaEquipamentoRequisitar"
                render={({ field }) => (
                  <SwitchRow
                    label="Exibir na Lista de Equipamentos?"
                    tooltip="Quando ativado, mostra o grupo na solicitação de equipamentos."
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── Configurações ─── */}
        <TabsContent value="config" className="mt-4">
          <div className="grid gap-4">
            <div>
              <Label className="flex items-center">
                Modalidade DICOM
                <HelpTip text="Selecione uma ou mais modalidades DICOM. Você também pode incluir outras siglas." />
              </Label>
              <Controller
                control={control}
                name="modalidadedicom"
                render={({ field }) => (
                  <DicomModalitySelector
                    value={field.value ?? ""}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3 rounded-md border bg-muted/40 p-3">
              <div>
                <Label className="text-xs text-muted-foreground">
                  Usuário de Cadastro
                </Label>
                <Input value={meta?.userId ?? "—"} readOnly disabled />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Criado em
                </Label>
                <Input
                  value={
                    meta?.created
                      ? new Date(meta.created).toLocaleString("pt-BR")
                      : "—"
                  }
                  readOnly
                  disabled
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">
                  Alterado em
                </Label>
                <Input
                  value={
                    meta?.modified
                      ? new Date(meta.modified).toLocaleString("pt-BR")
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

      <div className="flex items-center justify-end gap-2 border-t pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          <X className="mr-1 size-4" />
          {readOnly ? "Fechar" : "Cancelar"}
        </Button>
        {!readOnly && (
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <Save className="mr-1 size-4" />
            )}
            {mode === "create" ? "Cadastrar" : "Salvar alterações"}
          </Button>
        )}
      </div>
    </form>
  );
}

// silence unused-import warning when SwitchRow isn't referenced via a hook
export type { GrupoProcedimentoFormValues };
