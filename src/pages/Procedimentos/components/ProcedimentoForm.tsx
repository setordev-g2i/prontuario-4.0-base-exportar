import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  procedimentoSchema,
  PROCEDIMENTO_FIELD_LABELS,
  type ProcedimentoFormValues,
} from "@/lib/schemas/procedimento";
import {
  GRUPO_OPTIONS,
  PROC_MODULO_UTILIZACAO_OPTIONS,
  TIPO_COBRANCA_OPTIONS,
  SUBGRUPO_OPTIONS,
  ABA_FATURAMENTO_OPTIONS,
  SUS_SEXO_OPTIONS,
  SUS_GRUPO_OPTIONS,
  SUS_SUBGRUPO_OPTIONS,
  SUS_SISTEMA_FATURAMENTO_OPTIONS,
  CIHA_TIPO_OPTIONS,
  SUS_APAC_OPTIONS,
  ORIGEM_LAUDO_OPTIONS,
  LAUDO_FORMULARIO_OPTIONS,
  RESPONSAVEL_LAUDO_OPTIONS,
  REGRA_PAGAMENTO_OPTIONS,
  PROFISSIONAL_OPTIONS,
  GRUPO_AGENDA_SESSOES_OPTIONS,
  PRESCRICAO_TIPO_OPTIONS,
  ESTQ_ARTIGO_OPTIONS,
  type Procedimento,
} from "@/types/entities/Procedimento";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
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

export type ProcedimentoFormMode = "create" | "edit";

interface Props {
  mode: ProcedimentoFormMode;
  initialData?: Partial<ProcedimentoFormValues>;
  meta?: Pick<
    Procedimento,
    "userId" | "userModified" | "created" | "modified"
  > | null;
  onSubmit: (values: ProcedimentoFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
  readOnly?: boolean;
  activeTab: string;
  onActiveTabChange: (tab: string) => void;
}

const defaultValues: ProcedimentoFormValues = {
  nome: "",
  grupoId: 0 as unknown as number,
  anotacaoFolha: "",
  diasEntrega: null,
  procedimentoModuloUtilizacaoId: null,
  apelido: "",
  codigoTabAmb: "",
  situacaoId: 1,

  faturaTipoCobrancaFaturaValorId: 0 as unknown as number,
  procedimentoSubGrupoId: 0 as unknown as number,
  usaGuiaOutrasDespesas: false,
  usaGuiaResumoInternacao: false,
  usaGuiaSadt: false,
  usaGuiaHonorarioIndividual: false,
  usaGuiaConsulta: false,
  abaFaturamentoPadrao: null,
  consideraComoMatMed: false,

  susCodigoProcedimento: "",
  susNomeProcedimento: "",
  susSexo: "0",
  susPermanenciaMedia: 0,
  susPermanenciaTempo: 0,
  susPermanenciaMaximo: 0,
  susPontos: 0,
  susIdadeMinimaMeses: 0,
  susIdadeMaximaMeses: 0,
  susGrupoId: null,
  susSubgrupoId: null,
  susFormaOrganizacao: "",
  susModalidade: "",
  susSistemaFaturamento: 1,
  procedimentoPrincipal: false,
  susPreencheAihParto: false,
  susPreencheAihLaqueaduraVasectomia: false,
  susPreencheAihOpme: false,
  susPreencheAihUtiNeoNatal: false,
  susPreencheAihRegistroCivil: false,
  cihaTipoProcedimento: "0",
  susPreencheApacTipo: 1,

  nomeLaudo: "",
  digitaLaudo: false,
  origemLaudo: 0,
  laudoMetaFormularioId: null,
  responsavelAssinaturaLaudo: 1,

  produtividadeSolicitantePaga: false,
  regraPagamentoProdutividade: null,
  regraPagamentoProfissionalEspecifico: null,

  mostraTelaAtenderProcedimento: true,
  sadtMostraData: false,
  fichaAtendimentoImpressaUrlModelo: "",
  sumarioAltaHabilitado: false,
  habilitaRelAgendamento: false,

  homeCareVlCusto: null,
  hcaaCodigo: "",
  grupoAgendaSessoesId: null,

  prescricaoTipoId: null,
  seraUtilizadoAso: false,
  prescricaoHabilitaDescricaoCentroCirurgico: false,
  prescricaoHabilitaDescricaoCirurgicaBeiraLeito: false,
  geraEquipeAutomaticamente: false,
  permiteLancarEquipe: false,
  comboProcedimentos: false,
  estqArtigoId: null,
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
  tooltip?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border p-3">
      <div className="flex items-center text-sm">
        <span>{label}</span>
        {tooltip && <HelpTip text={tooltip} />}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} disabled={disabled} />
    </div>
  );
}

function numberSetValueAs(v: unknown) {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function intSetValueAs(v: unknown) {
  if (v === "" || v === null || v === undefined) return 0;
  const n = parseInt(String(v), 10);
  return Number.isNaN(n) ? 0 : n;
}

export function ProcedimentoForm({
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
  const form = useForm<ProcedimentoFormValues>({
    resolver: zodResolver(procedimentoSchema),
    mode: "onChange",
    defaultValues: { ...defaultValues, ...initialData },
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = form;

  const disabled = readOnly;
  const nomeAtual = watch("nome");
  const susNomeAtual = watch("susNomeProcedimento");

  // Em modo criação: replicar Nome -> Nome SUS quando SUS Nome estiver vazio
  function handleNomeBlur() {
    if (mode === "create" && nomeAtual && !susNomeAtual) {
      setValue("susNomeProcedimento", nomeAtual, { shouldValidate: true });
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) =>
        notifyRequiredErrors(errs, PROCEDIMENTO_FIELD_LABELS),
      )}
      className="space-y-4"
    >
      <Tabs value={activeTab} onValueChange={onActiveTabChange}>
        <TabsList className="flex flex-wrap h-auto">
          <TabsTrigger value="principal">Dados Principais</TabsTrigger>
          <TabsTrigger value="faturamento">Faturamento</TabsTrigger>
          <TabsTrigger value="sus">SUS</TabsTrigger>
          <TabsTrigger value="laudo">Laudo</TabsTrigger>
          <TabsTrigger value="produtividade">Produtividade</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
          <TabsTrigger value="homecare">Home Care</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
        </TabsList>

        {/* ─── Dados Principais ─── */}
        <TabsContent value="principal" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome *</Label>
              <Input
                id="nome"
                disabled={disabled}
                {...register("nome", { onBlur: handleNomeBlur })}
                className={cn(errors.nome && "border-destructive")}
              />
            </div>

            <div>
              <Label>Grupo *</Label>
              <Controller
                control={control}
                name="grupoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(errors.grupoId && "border-destructive")}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRUPO_OPTIONS.map((o) => (
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
              <Label htmlFor="anotacaoFolha">Anotação Folha</Label>
              <Input
                id="anotacaoFolha"
                disabled={disabled}
                {...register("anotacaoFolha")}
              />
            </div>

            <div>
              <Label htmlFor="diasEntrega">Dias/Entrega</Label>
              <Input
                id="diasEntrega"
                type="number"
                min={0}
                step={1}
                disabled={disabled}
                {...register("diasEntrega", { setValueAs: numberSetValueAs })}
              />
            </div>

            <div>
              <Label className="flex items-center">
                Utilização
                <HelpTip text="Procedimento Módulo Utilização" />
              </Label>
              <Controller
                control={control}
                name="procedimentoModuloUtilizacaoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROC_MODULO_UTILIZACAO_OPTIONS.map((o) => (
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
              <Label htmlFor="apelido" className="flex items-center">
                Apelido
                <HelpTip text="Nome reduzido ou apelido do procedimento." />
              </Label>
              <Input
                id="apelido"
                disabled={disabled}
                {...register("apelido")}
              />
            </div>

            <div>
              <Label htmlFor="codigoTabAmb" className="flex items-center">
                Código Tabela
                <HelpTip text="Código do Procedimento AMB, CBHPM e outros." />
              </Label>
              <Input
                id="codigoTabAmb"
                disabled={disabled}
                {...register("codigoTabAmb")}
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── Faturamento ─── */}
        <TabsContent value="faturamento" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="flex items-center">
                Tipo de Cobrança *
                <HelpTip text="Tipo de Cobrança da Fatura" />
              </Label>
              <Controller
                control={control}
                name="faturaTipoCobrancaFaturaValorId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(
                        errors.faturaTipoCobrancaFaturaValorId &&
                          "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPO_COBRANCA_OPTIONS.map((o) => (
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
              <Label>Subgrupo *</Label>
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

            <div>
              <Label>Aba de Faturamento Padrão</Label>
              <Controller
                control={control}
                name="abaFaturamentoPadrao"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ABA_FATURAMENTO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2 grid gap-3 md:grid-cols-2">
              {(
                [
                  ["usaGuiaOutrasDespesas", "TISS - Mostra Guia Outras Despesas"],
                  ["usaGuiaResumoInternacao", "TISS - Mostra Guia Resumo Internação"],
                  ["usaGuiaSadt", "TISS - Mostra Guia SADT"],
                  ["usaGuiaHonorarioIndividual", "TISS - Mostra Guia Honorário Individual"],
                  ["usaGuiaConsulta", "TISS - Mostra Guia Consulta"],
                ] as const
              ).map(([name, label]) => (
                <div key={name}>
                  <Label>{label}</Label>
                  <Controller
                    control={control}
                    name={name}
                    render={({ field }) => (
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(v) => field.onChange(v === "true")}
                        disabled={disabled}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Sim</SelectItem>
                          <SelectItem value="false">Não</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="md:col-span-2">
              <Controller
                control={control}
                name="consideraComoMatMed"
                render={({ field }) => (
                  <SwitchRow
                    label="Considerar como Material/Medicamento?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ─── SUS ─── */}
        <TabsContent value="sus" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="flex items-center">
                Código SUS *<HelpTip text="Código do Procedimento no SUS" />
              </Label>
              <Input
                disabled={disabled}
                {...register("susCodigoProcedimento")}
                className={cn(
                  errors.susCodigoProcedimento && "border-destructive",
                )}
              />
            </div>

            <div>
              <Label className="flex items-center">
                Nome SUS *<HelpTip text="Nome do Procedimento no SUS" />
              </Label>
              <Input
                disabled={disabled}
                {...register("susNomeProcedimento")}
                className={cn(
                  errors.susNomeProcedimento && "border-destructive",
                )}
              />
            </div>

            <div>
              <Label>Regra Sexo *</Label>
              <Controller
                control={control}
                name="susSexo"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(v) => field.onChange(v as "0" | "M" | "F")}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(errors.susSexo && "border-destructive")}
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {SUS_SEXO_OPTIONS.map((o) => (
                        <SelectItem key={o.value} value={o.value}>
                          {o.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label>Sistema de Faturamento *</Label>
              <Controller
                control={control}
                name="susSistemaFaturamento"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      className={cn(
                        errors.susSistemaFaturamento && "border-destructive",
                      )}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUS_SISTEMA_FATURAMENTO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {(
              [
                ["susPermanenciaMedia", "Permanência Média *"],
                ["susPermanenciaTempo", "Tempo de Permanência *"],
                ["susPermanenciaMaximo", "Permanência Máxima *"],
                ["susPontos", "Pontos *"],
                ["susIdadeMinimaMeses", "Idade Mínima (meses) *"],
                ["susIdadeMaximaMeses", "Idade Máxima (meses) *"],
              ] as const
            ).map(([name, label]) => (
              <div key={name}>
                <Label>{label}</Label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  disabled={disabled}
                  {...register(name, { setValueAs: intSetValueAs })}
                  className={cn(errors[name] && "border-destructive")}
                />
              </div>
            ))}

            <div>
              <Label>Grupos</Label>
              <Controller
                control={control}
                name="susGrupoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUS_GRUPO_OPTIONS.map((o) => (
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
              <Label>Subgrupos</Label>
              <Controller
                control={control}
                name="susSubgrupoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUS_SUBGRUPO_OPTIONS.map((o) => (
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
              <Label>Forma Organização *</Label>
              <Input
                disabled={disabled}
                {...register("susFormaOrganizacao")}
                className={cn(
                  errors.susFormaOrganizacao && "border-destructive",
                )}
              />
            </div>

            <div>
              <Label>Modalidade *</Label>
              <Input
                disabled={disabled}
                {...register("susModalidade")}
                className={cn(errors.susModalidade && "border-destructive")}
              />
            </div>
          </div>

          {/* AIH */}
          <div className="mt-6 rounded-md border p-4">
            <div className="mb-3 text-sm font-semibold">AIH</div>
            <div className="grid gap-3 md:grid-cols-2">
              {(
                [
                  ["procedimentoPrincipal", "Procedimento Principal?"],
                  ["susPreencheAihParto", 'Preenche campos "Parto"?'],
                  [
                    "susPreencheAihLaqueaduraVasectomia",
                    'Preenche campos "Laqueadura/Vasectomia"?',
                  ],
                  ["susPreencheAihOpme", 'Preenche campos "OPME"?'],
                  [
                    "susPreencheAihUtiNeoNatal",
                    'Preenche campos "UTI Neo Natal"?',
                  ],
                  [
                    "susPreencheAihRegistroCivil",
                    'Preenche campos "Registro Civil"?',
                  ],
                ] as const
              ).map(([name, label]) => (
                <Controller
                  key={name}
                  control={control}
                  name={name}
                  render={({ field }) => (
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={!!field.value}
                        onCheckedChange={(v) => field.onChange(!!v)}
                        disabled={disabled}
                      />
                      {label}
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          {/* CIHA */}
          <div className="mt-4 rounded-md border p-4">
            <div className="mb-3 text-sm font-semibold">CIHA</div>
            <Label>Aparece na CIHA como</Label>
            <Controller
              control={control}
              name="cihaTipoProcedimento"
              render={({ field }) => (
                <Select
                  value={field.value ?? "0"}
                  onValueChange={(v) => field.onChange(v)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CIHA_TIPO_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* APAC */}
          <div className="mt-4 rounded-md border p-4">
            <div className="mb-3 text-sm font-semibold">APAC</div>
            <Label>Habilita Faturamento APAC Como</Label>
            <Controller
              control={control}
              name="susPreencheApacTipo"
              render={({ field }) => (
                <Select
                  value={field.value ? String(field.value) : ""}
                  onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                  disabled={disabled}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUS_APAC_OPTIONS.map((o) => (
                      <SelectItem key={o.id} value={String(o.id)}>
                        {o.id} - {o.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        </TabsContent>

        {/* ─── Laudo ─── */}
        <TabsContent value="laudo" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label>Nome Laudo *</Label>
              <Input
                disabled={disabled}
                {...register("nomeLaudo")}
                className={cn(errors.nomeLaudo && "border-destructive")}
              />
            </div>

            <Controller
              control={control}
              name="digitaLaudo"
              render={({ field }) => (
                <SwitchRow
                  label="Digita Laudo?"
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />

            <div>
              <Label>Origem do Laudo</Label>
              <Controller
                control={control}
                name="origemLaudo"
                render={({ field }) => (
                  <Select
                    value={
                      field.value !== null && field.value !== undefined
                        ? String(field.value)
                        : ""
                    }
                    onValueChange={(v) => field.onChange(v !== "" ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ORIGEM_LAUDO_OPTIONS.map((o) => (
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
              <Label>Formulário de Laudo</Label>
              <Controller
                control={control}
                name="laudoMetaFormularioId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {LAUDO_FORMULARIO_OPTIONS.map((o) => (
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
                Responsável Laudo
                <HelpTip text="Responsável pela Assinatura do Laudo" />
              </Label>
              <Controller
                control={control}
                name="responsavelAssinaturaLaudo"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {RESPONSAVEL_LAUDO_OPTIONS.map((o) => (
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

        {/* ─── Produtividade ─── */}
        <TabsContent value="produtividade" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Controller
              control={control}
              name="produtividadeSolicitantePaga"
              render={({ field }) => (
                <SwitchRow
                  label="Produtividade Solicitante?"
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />

            <div>
              <Label>Regra de Pagamento da Produtividade</Label>
              <Controller
                control={control}
                name="regraPagamentoProdutividade"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {REGRA_PAGAMENTO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2">
              <Label>Profissional Específico para Pagamento</Label>
              <Controller
                control={control}
                name="regraPagamentoProfissionalEspecifico"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROFISSIONAL_OPTIONS.map((o) => (
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

        {/* ─── Relatórios ─── */}
        <TabsContent value="relatorios" className="mt-4">
          <div className="grid gap-3">
            <Controller
              control={control}
              name="mostraTelaAtenderProcedimento"
              render={({ field }) => (
                <SwitchRow
                  label="Exibir na Tela de Atendimento?"
                  tooltip="Define se o procedimento será mostrado na tela de atendimento."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="sadtMostraData"
              render={({ field }) => (
                <SwitchRow
                  label="Mostrar Data na Guia SADT?"
                  tooltip="Mostra ou oculta a data de execução na guia SADT."
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <div>
              <Label>Modelo de Impressão da Ficha</Label>
              <Input
                disabled={disabled}
                {...register("fichaAtendimentoImpressaUrlModelo")}
              />
            </div>
            <Controller
              control={control}
              name="sumarioAltaHabilitado"
              render={({ field }) => (
                <SwitchRow
                  label="Habilita no Sumário de Alta?"
                  checked={!!field.value}
                  onChange={field.onChange}
                  disabled={disabled}
                />
              )}
            />
            <Controller
              control={control}
              name="habilitaRelAgendamento"
              render={({ field }) => (
                <SwitchRow
                  label="Habilita Relatório de Agendamento?"
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
            <div>
              <Label>Custo Home Care</Label>
              <Input
                type="number"
                step="0.01"
                min={0}
                disabled={disabled}
                {...register("homeCareVlCusto", {
                  setValueAs: numberSetValueAs,
                })}
              />
            </div>
            <div>
              <Label>Código HCAA</Label>
              <Input disabled={disabled} {...register("hcaaCodigo")} />
            </div>
            <div className="md:col-span-2">
              <Label>Grupo Agenda Sessões</Label>
              <Controller
                control={control}
                name="grupoAgendaSessoesId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRUPO_AGENDA_SESSOES_OPTIONS.map((o) => (
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

        {/* ─── Configurações ─── */}
        <TabsContent value="config" className="mt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>Tipo de Prescrição</Label>
              <Controller
                control={control}
                name="prescricaoTipoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {PRESCRICAO_TIPO_OPTIONS.map((o) => (
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
              <Label>Artigo de Estoque</Label>
              <Controller
                control={control}
                name="estqArtigoId"
                render={({ field }) => (
                  <Select
                    value={field.value ? String(field.value) : ""}
                    onValueChange={(v) => field.onChange(v ? Number(v) : null)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTQ_ARTIGO_OPTIONS.map((o) => (
                        <SelectItem key={o.id} value={String(o.id)}>
                          {o.id} - {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="md:col-span-2 grid gap-3">
              <Controller
                control={control}
                name="seraUtilizadoAso"
                render={({ field }) => (
                  <SwitchRow
                    label="Utilizar no ASO?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name="prescricaoHabilitaDescricaoCentroCirurgico"
                render={({ field }) => (
                  <SwitchRow
                    label="Habilita Descrição Centro Cirúrgico?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name="prescricaoHabilitaDescricaoCirurgicaBeiraLeito"
                render={({ field }) => (
                  <SwitchRow
                    label="Habilita Descrição Cirúrgica Beira Leito?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name="geraEquipeAutomaticamente"
                render={({ field }) => (
                  <SwitchRow
                    label="Gerar Equipe Automaticamente?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name="permiteLancarEquipe"
                render={({ field }) => (
                  <SwitchRow
                    label="Permite Lançar Equipe?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
              <Controller
                control={control}
                name="comboProcedimentos"
                render={({ field }) => (
                  <SwitchRow
                    label="Possui Combo de Procedimentos?"
                    checked={!!field.value}
                    onChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            {meta && (
              <div className="md:col-span-2 grid grid-cols-2 gap-4 rounded-md border bg-muted/40 p-4 text-xs">
                <div>
                  <div className="font-medium text-muted-foreground">
                    Usuário de Cadastro
                  </div>
                  <div>{meta.userId ?? "—"}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Usuário da Alteração
                  </div>
                  <div>{meta.userModified ?? "—"}</div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Criado em
                  </div>
                  <div>
                    {meta.created
                      ? new Date(meta.created).toLocaleString("pt-BR")
                      : "—"}
                  </div>
                </div>
                <div>
                  <div className="font-medium text-muted-foreground">
                    Alterado em
                  </div>
                  <div>
                    {meta.modified
                      ? new Date(meta.modified).toLocaleString("pt-BR")
                      : "—"}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {!readOnly && (
        <div className="flex justify-end gap-2 border-t pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitting}
          >
            <X className="mr-1 size-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={submitting}>
            {submitting ? (
              <Loader2 className="mr-1 size-4 animate-spin" />
            ) : (
              <Save className="mr-1 size-4" />
            )}
            Salvar
          </Button>
        </div>
      )}
    </form>
  );
}

export type { ProcedimentoFormValues };
