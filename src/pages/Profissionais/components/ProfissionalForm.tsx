import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  profissionalFormSchema,
  PROFISSIONAL_FIELD_LABELS,
  type ProfissionalFormValues,
} from "@/lib/schemas/profissionais/formSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InputMasked } from "@/components/InputMasked";
import { MASKS } from "@/lib/masks";
import { Loader2, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { notifyRequiredErrors } from "@/lib/forms/notifyRequired";

export type ProfissionalFormMode = "create" | "edit";

interface ProfissionalFormProps {
  mode: ProfissionalFormMode;
  initialData?: Partial<ProfissionalFormValues>;
  onSubmit: (values: ProfissionalFormValues) => Promise<void> | void;
  onCancel: () => void;
  submitting?: boolean;
  readOnly?: boolean;
}

const TIPOS_CADASTRO = [
  { id: "medico", value: "Médico" },
  { id: "enfermeiro", value: "Enfermeiro" },
  { id: "fisioterapeuta", value: "Fisioterapeuta" },
  { id: "psicologo", value: "Psicólogo" },
];

const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
].map((uf) => ({ id: uf, value: uf }));

const ESTADOS_CIVIS = [
  { id: "solteiro", value: "Solteiro(a)" },
  { id: "casado", value: "Casado(a)" },
  { id: "divorciado", value: "Divorciado(a)" },
  { id: "viuvo", value: "Viúvo(a)" },
  { id: "uniao_estavel", value: "União Estável" },
];

const ETNIAS = [
  { id: "branca", value: "Branca" },
  { id: "preta", value: "Preta" },
  { id: "parda", value: "Parda" },
  { id: "amarela", value: "Amarela" },
  { id: "indigena", value: "Indígena" },
];

const ESCOLARIDADES = [
  { id: "fundamental", value: "Ensino Fundamental" },
  { id: "medio", value: "Ensino Médio" },
  { id: "superior", value: "Ensino Superior" },
  { id: "pos", value: "Pós-graduação" },
  { id: "mestrado", value: "Mestrado" },
  { id: "doutorado", value: "Doutorado" },
];

const STATUS_CONSELHO = [
  { id: "ativo", value: "Ativo" },
  { id: "suspenso", value: "Suspenso" },
  { id: "cancelado", value: "Cancelado" },
];

const UNIDADES = [
  { id: "u1", value: "Unidade Central" },
  { id: "u2", value: "Unidade Norte" },
];

const SOLICITANTES = [
  { id: "s1", value: "Solicitante A" },
  { id: "s2", value: "Solicitante B" },
];

const CONFIG_APURACAO = [
  { id: "mensal", value: "Mensal" },
  { id: "quinzenal", value: "Quinzenal" },
  { id: "semanal", value: "Semanal" },
];

const defaultValues: ProfissionalFormValues = {
  nome: "",
  tipoCadastroId: "",
  cpf: "",
  rg: "",
  dataNascimento: "",
  sexo: undefined,
  email: "",
  celular: "",
  telefone: "",
  situacaoId: 1,
  cep: "",
  endereco: "",
  numero: "",
  complemento: "",
  cidade: "",
  estadoId: "",
  estadoCivilId: "",
  religiao: "",
  etniaId: "",
  escolaridadeId: "",
  regiaoHomeCare: "",
  sigla: "",
  conselho: "",
  statusConselhoId: "",
  rqe: "",
  nomeLaudo: "",
  conselhoLaudo: "",
  cns: "",
  pis: "",
  cbo: "",
  cnes: "",
  tipoPessoa: "",
  banco: "",
  agencia: "",
  conta: "",
  configApuracaoId: "",
  contabilidade: "",
  fornecedor: "",
  planosConta: "",
  tabelaRepasse: "",
  atendePsiquiatricos: false,
  cadastrarAgenda: false,
  unidadeId: "",
  solicitanteSusId: "",
  vinculoSus: "",
};

/**
 * Form compartilhado entre cadastro (novo), edição e visualização de Profissionais.
 * Estruturado em 7 abas conforme especificação do produto.
 */
export function ProfissionalForm({
  mode,
  initialData,
  onSubmit,
  onCancel,
  submitting = false,
  readOnly = false,
}: ProfissionalFormProps) {
  const form = useForm<ProfissionalFormValues>({
    resolver: zodResolver(profissionalFormSchema),
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
        notifyRequiredErrors(errs, PROFISSIONAL_FIELD_LABELS),
      )}
      className="space-y-4"
      aria-label={
        readOnly
          ? "Visualizar profissional"
          : mode === "create"
            ? "Cadastrar profissional"
            : "Editar profissional"
      }
    >
      <Tabs defaultValue="principais">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="principais">Dados Principais</TabsTrigger>
          <TabsTrigger value="comp1">Complementares I</TabsTrigger>
          <TabsTrigger value="comp2">Complementares II</TabsTrigger>
          <TabsTrigger value="documentos">Documentos e Registros</TabsTrigger>
          <TabsTrigger value="financeiro">Financeiro</TabsTrigger>
          <TabsTrigger value="config">Configurações</TabsTrigger>
          <TabsTrigger value="sus">SUS</TabsTrigger>
        </TabsList>

        {/* ───── Dados Principais ───── */}
        <TabsContent value="principais" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <Label htmlFor="nome">Nome completo *</Label>
              <Input
                id="nome"
                disabled={disabled}
                {...register("nome")}
                className={cn(errors.nome && "border-destructive")}
              />
              {errors.nome && (
                <p className="mt-1 text-xs text-destructive">{errors.nome.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="tipoCadastroId">Tipo de Cadastro *</Label>
              <Controller
                control={control}
                name="tipoCadastroId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger
                      id="tipoCadastroId"
                      className={cn(errors.tipoCadastroId && "border-destructive")}
                    >
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_CADASTRO.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.tipoCadastroId && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.tipoCadastroId.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="situacaoId">Situação *</Label>
              <Controller
                control={control}
                name="situacaoId"
                render={({ field }) => (
                  <Select
                    value={String(field.value)}
                    onValueChange={(v) => field.onChange(Number(v))}
                    disabled={disabled}
                  >
                    <SelectTrigger id="situacaoId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 - Ativo</SelectItem>
                      <SelectItem value="2">2 - Inativo</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF *</Label>
              <Controller
                control={control}
                name="cpf"
                render={({ field }) => (
                  <InputMasked
                    id="cpf"
                    mask={MASKS.CPF}
                    value={field.value}
                    onChange={(v: string) => field.onChange(v)}
                    hasError={!!errors.cpf}
                    disabled={disabled}
                  />
                )}
              />
              {errors.cpf && (
                <p className="mt-1 text-xs text-destructive">{errors.cpf.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="rg">RG</Label>
              <Input id="rg" disabled={disabled} {...register("rg")} />
            </div>

            <div>
              <Label htmlFor="dataNascimento">Dt. Nascimento *</Label>
              <Input
                id="dataNascimento"
                type="date"
                disabled={disabled}
                {...register("dataNascimento")}
                className={cn(errors.dataNascimento && "border-destructive")}
              />
              {errors.dataNascimento && (
                <p className="mt-1 text-xs text-destructive">
                  {errors.dataNascimento.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="sexo">Sexo</Label>
              <Controller
                control={control}
                name="sexo"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={(v) =>
                      field.onChange(v as "masculino" | "feminino" | "outro")
                    }
                    disabled={disabled}
                  >
                    <SelectTrigger id="sexo">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                disabled={disabled}
                {...register("email")}
                className={cn(errors.email && "border-destructive")}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="celular">Celular</Label>
              <Controller
                control={control}
                name="celular"
                render={({ field }) => (
                  <InputMasked
                    id="celular"
                    mask={MASKS.CELULAR}
                    value={field.value ?? ""}
                    onChange={(v: string) => field.onChange(v)}
                    disabled={disabled}
                  />
                )}
              />
            </div>

            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Controller
                control={control}
                name="telefone"
                render={({ field }) => (
                  <InputMasked
                    id="telefone"
                    mask={MASKS.TELEFONE}
                    value={field.value ?? ""}
                    onChange={(v: string) => field.onChange(v)}
                    disabled={disabled}
                  />
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── Complementares I ───── */}
        <TabsContent value="comp1" className="pt-4">
          <div className="grid gap-4 md:grid-cols-6">
            <div className="md:col-span-2">
              <Label htmlFor="cep">CEP</Label>
              <Controller
                control={control}
                name="cep"
                render={({ field }) => (
                  <InputMasked
                    id="cep"
                    mask={MASKS.CEP}
                    value={field.value ?? ""}
                    onChange={(v: string) => field.onChange(v)}
                    disabled={disabled}
                  />
                )}
              />
            </div>
            <div className="md:col-span-4">
              <Label htmlFor="endereco">Endereço</Label>
              <Input id="endereco" disabled={disabled} {...register("endereco")} />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="numero">Número</Label>
              <Input id="numero" disabled={disabled} {...register("numero")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="complemento">Complemento</Label>
              <Input
                id="complemento"
                disabled={disabled}
                {...register("complemento")}
              />
            </div>
            <div className="md:col-span-3">
              <Label htmlFor="cidade">Cidade</Label>
              <Input id="cidade" disabled={disabled} {...register("cidade")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="estadoId">Estado</Label>
              <Controller
                control={control}
                name="estadoId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="estadoId">
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {UFS.map((u) => (
                        <SelectItem key={u.id} value={u.id}>
                          {u.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── Complementares II ───── */}
        <TabsContent value="comp2" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="estadoCivilId">Estado Civil</Label>
              <Controller
                control={control}
                name="estadoCivilId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="estadoCivilId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_CIVIS.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="religiao">Religião</Label>
              <Input id="religiao" disabled={disabled} {...register("religiao")} />
            </div>
            <div>
              <Label htmlFor="etniaId">Etnia</Label>
              <Controller
                control={control}
                name="etniaId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="etniaId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ETNIAS.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="escolaridadeId">Escolaridade</Label>
              <Controller
                control={control}
                name="escolaridadeId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="escolaridadeId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESCOLARIDADES.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="regiaoHomeCare">Região Responsável Home Care</Label>
              <Input
                id="regiaoHomeCare"
                disabled={disabled}
                {...register("regiaoHomeCare")}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── Documentos e Registros ───── */}
        <TabsContent value="documentos" className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="sigla">Sigla</Label>
              <Input id="sigla" disabled={disabled} {...register("sigla")} />
            </div>
            <div>
              <Label htmlFor="conselho">Conselho (CRM)</Label>
              <Input id="conselho" disabled={disabled} {...register("conselho")} />
            </div>
            <div>
              <Label htmlFor="statusConselhoId">Status Conselho</Label>
              <Controller
                control={control}
                name="statusConselhoId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="statusConselhoId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUS_CONSELHO.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="rqe">RQE</Label>
              <Input id="rqe" disabled={disabled} {...register("rqe")} />
            </div>
            <div>
              <Label htmlFor="nomeLaudo">Nome Laudo</Label>
              <Input id="nomeLaudo" disabled={disabled} {...register("nomeLaudo")} />
            </div>
            <div>
              <Label htmlFor="conselhoLaudo">Conselho Laudo</Label>
              <Input
                id="conselhoLaudo"
                disabled={disabled}
                {...register("conselhoLaudo")}
              />
            </div>
            <div>
              <Label htmlFor="cns">Cartão Nacional Saúde</Label>
              <Input id="cns" disabled={disabled} {...register("cns")} />
            </div>
            <div>
              <Label htmlFor="pis">PIS</Label>
              <Input id="pis" disabled={disabled} {...register("pis")} />
            </div>
            <div>
              <Label htmlFor="cbo">CBO</Label>
              <Input id="cbo" disabled={disabled} {...register("cbo")} />
            </div>
            <div>
              <Label htmlFor="cnes">CNES</Label>
              <Input id="cnes" disabled={disabled} {...register("cnes")} />
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="tipoPessoa">Tipo de Pessoa</Label>
              <Input
                id="tipoPessoa"
                disabled={disabled}
                {...register("tipoPessoa")}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── Financeiro ───── */}
        <TabsContent value="financeiro" className="pt-4">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="banco">Banco</Label>
              <Input id="banco" disabled={disabled} {...register("banco")} />
            </div>
            <div>
              <Label htmlFor="agencia">Agência</Label>
              <Input id="agencia" disabled={disabled} {...register("agencia")} />
            </div>
            <div>
              <Label htmlFor="conta">Conta</Label>
              <Input id="conta" disabled={disabled} {...register("conta")} />
            </div>
            <div>
              <Label htmlFor="configApuracaoId">Configuração Apuração</Label>
              <Controller
                control={control}
                name="configApuracaoId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="configApuracaoId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONFIG_APURACAO.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="contabilidade">Contabilidade</Label>
              <Input
                id="contabilidade"
                disabled={disabled}
                {...register("contabilidade")}
              />
            </div>
            <div>
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                disabled={disabled}
                {...register("fornecedor")}
              />
            </div>
            <div>
              <Label htmlFor="planosConta">Planos de Conta</Label>
              <Input
                id="planosConta"
                disabled={disabled}
                {...register("planosConta")}
              />
            </div>
            <div>
              <Label htmlFor="tabelaRepasse">Tabela Repasse</Label>
              <Input
                id="tabelaRepasse"
                disabled={disabled}
                {...register("tabelaRepasse")}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── Configurações ───── */}
        <TabsContent value="config" className="pt-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
              <div>
                <Label htmlFor="atendePsiquiatricos" className="font-medium">
                  Atende Pacientes Psiquiátricos?
                </Label>
              </div>
              <Controller
                control={control}
                name="atendePsiquiatricos"
                render={({ field }) => (
                  <Switch
                    id="atendePsiquiatricos"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between rounded-md border p-3 md:col-span-2">
              <div>
                <Label htmlFor="cadastrarAgenda" className="font-medium">
                  Cadastrar Agenda?
                </Label>
              </div>
              <Controller
                control={control}
                name="cadastrarAgenda"
                render={({ field }) => (
                  <Switch
                    id="cadastrarAgenda"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                )}
              />
            </div>
            <div>
              <Label htmlFor="unidadeId">Unidade</Label>
              <Controller
                control={control}
                name="unidadeId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="unidadeId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {UNIDADES.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
            <div>
              <Label htmlFor="solicitanteSusId">Solicitante</Label>
              <Controller
                control={control}
                name="solicitanteSusId"
                render={({ field }) => (
                  <Select
                    value={field.value ?? ""}
                    onValueChange={field.onChange}
                    disabled={disabled}
                  >
                    <SelectTrigger id="solicitanteSusId">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      {SOLICITANTES.map((o) => (
                        <SelectItem key={o.id} value={o.id}>
                          {o.value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </TabsContent>

        {/* ───── SUS ───── */}
        <TabsContent value="sus" className="pt-4 space-y-4">
          <div>
            <Label htmlFor="vinculoSus">Vínculo SUS</Label>
            <Input
              id="vinculoSus"
              disabled={disabled}
              {...register("vinculoSus")}
            />
          </div>
          <div className="rounded-md border p-4">
            <div className="text-sm font-medium mb-2">Datas de exportação</div>
            <p className="text-xs text-muted-foreground">
              Nenhuma exportação registrada.
            </p>
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
